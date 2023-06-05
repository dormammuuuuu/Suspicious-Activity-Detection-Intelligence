# limit the number of cpus used by high performance libraries
import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import sys
sys.path.insert(0, './yolov5')

import argparse
import os
import platform
import shutil
import time
from pathlib import Path
import cv2
import torch
import torch.backends.cudnn as cudnn

from yolov5.models.experimental import attempt_load
from yolov5.utils.downloads import attempt_download
from yolov5.models.common import DetectMultiBackend
from yolov5.utils.dataloaders import LoadImages, LoadStreams
from yolov5.utils.general import (LOGGER, check_img_size, non_max_suppression, scale_boxes, 
                                  check_imshow, xyxy2xywh, increment_path)
from yolov5.utils.torch_utils import select_device, time_sync
from yolov5.utils.plots import Annotator, colors
from deep_sort.utils.parser import get_config
from deep_sort.deep_sort import DeepSort

from pose_estimation.pose import Pose
import mediapipe as mp
from tensorflow.keras.models import load_model

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]  # yolov5 deepsort root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH
ROOT = Path(os.path.relpath(ROOT, Path.cwd()))  # relative


class Track:  
    def __init__(self):
        self.count = 0
        self.data = []
        self.person_id = []
        self.seq_array = []
        self.sequence = []
        self.predicted_action = ''
        self.yolo_model = ['weights/person.pt',
                           'weights/hammer.pt', 
                           'weights/heavygun.pt', 
                           'weights/knife.pt',  
                           'weights/scissor.pt',  
                           'weights/pistol.pt']  # path to model file
        self.deep_sort_model = 'osnet_x0_25'  # path to deep sort model file
        self.source = 'rtsp://admin:SADIvision04@192.168.1.64:554/Streaming/Channels/2'  # source
        self.out = 'inference/output'
        self.imgsz = (640,480)  # inference size (pixels)
        self.conf_thres = 0.4  # confidence threshold
        self.iou_thres = 0.4 # NMS IOU threshold
        self.fourcc = 'mp4v'  # output video codec (verify ffmpeg support)
        self.device = 0  # cuda device, i.e. 0 or 0,1,2,3 or cpu
        self.show_vid = True  # show video output  
        self.save_vid = True  # save video output
        self.save_txt = True  # save txt output
        self.classes = None  # filter by class: --class 0, or --class 0 2 3
        self.agnostic_nms = False  # class-agnostic NMS
        self.augment = False  # augmented inference
        self.evaluate = False  # model evaluation mode
        self.config_deepsort = 'deep_sort/configs/deep_sort.yaml'  # deep sort config file
        self.half = False  # use FP16 half-precision inference
        self.visualize = False  # visualize features
        self.max_det = 1000 # maximum detections per image
        self.dnn = False  # use DNN for ONNX models
        self.project = 'runs/track'  # save results to project/name
        self.name = 'exp'  # save results to project/name
        self.exist_ok = False  # existing project/name ok, do not increment
        self.mp_holistic = mp.solutions.holistic # Holistic model
        
    def run(self):
        pose = Pose(action_model = load_model('weights/action_v5.h5'))
        webcam = self.source == '0' or self.source.startswith(
            'rtsp') or self.source.startswith('http') or self.source.endswith('.txt')

        # initialize deepsort
        cfg = get_config()
        cfg.merge_from_file(self.config_deepsort)
        deepsort = DeepSort(self.deep_sort_model,
                            max_dist=cfg.DEEPSORT.MAX_DIST,
                            max_iou_distance=cfg.DEEPSORT.MAX_IOU_DISTANCE,
                            max_age=cfg.DEEPSORT.MAX_AGE, n_init=cfg.DEEPSORT.N_INIT, nn_budget=cfg.DEEPSORT.NN_BUDGET,
                            use_cuda=True)

        # Initialize
        device = select_device(self.device)
        self.half &= device.type != 'cpu'  # half precision only supported on CUDA

        # The MOT16 evaluation runs multiple inference streams in parallel, each one writing to
        # its own .txt file. Hence, in that case, the output folder is not restored
        if not self.evaluate:
            if os.path.exists(self.out):
                pass
                shutil.rmtree(self.out)  # delete output folder
            os.makedirs(self.out)  # make new output folder

        # Directories
        save_dir = increment_path(Path(self.project) / self.name, exist_ok=self.exist_ok)  # increment run
        save_dir.mkdir(parents=True, exist_ok=True)  # make dir

        # Load model
        device = select_device(device)
        model = DetectMultiBackend(self.yolo_model, device=device, dnn=self.dnn)
        stride, names, pt, jit, _ = model.stride, model.names, model.pt, model.jit, model.onnx
        imgsz = check_img_size(self.imgsz, s=stride)  # check image size

        # Half
        self.half &= pt and device.type != 'cpu'  # half precision only supported by PyTorch on CUDA
        if pt:
            model.model.half() if self.half else model.model.float()

        # Set Dataloader
        vid_path, vid_writer = None, None
        # Check if environment supports image displays
        if self.show_vid:
            show_vid = check_imshow()

        # Dataloader
        if webcam:
            show_vid = check_imshow()
            cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(self.source, img_size=imgsz, stride=stride, auto=pt and not jit)
            bs = len(dataset)  # batch_size
        else:
            dataset = LoadImages(self.source, img_size=imgsz, stride=stride, auto=pt and not jit)
            bs = 1  # batch_size
        vid_path, vid_writer = [None] * bs, [None] * bs

        # Get names and colors
        names = model.module.names if hasattr(model, 'module') else model.names

        # extract what is in between the last '/' and last '.'
        txt_file_name = self.source.split('/')[-1].split('.')[0]
        txt_path = str(Path(save_dir)) + '/' + txt_file_name + '.txt'

        if pt and device.type != 'cpu':
            model(torch.zeros(1, 3, *imgsz).to(device).type_as(next(model.model.parameters())))  # warmup
        dt, seen = [0.0, 0.0, 0.0, 0.0], 0
        for frame_idx, (path, img, im0s, vid_cap, s) in enumerate(dataset):
            t1 = time_sync()
            img = torch.from_numpy(img).to(device)
            img = img.half() if self.half else img.float()  # uint8 to fp16/32
            img /= 255.0  # 0 - 255 to 0.0 - 1.0
            if img.ndimension() == 3:
                img = img.unsqueeze(0)
            t2 = time_sync()
            dt[0] += t2 - t1

            # Inference
            visualize = increment_path(save_dir / Path(path).stem, mkdir=True) if self.visualize else False
            pred = model(img, augment=self.augment, visualize=visualize)
            t3 = time_sync()
            dt[1] += t3 - t2

            # Apply NMS
            pred = non_max_suppression(pred, self.conf_thres, self.iou_thres, self.classes, self.agnostic_nms, max_det=self.max_det)
            dt[2] += time_sync() - t3
            
            with self.mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            # Process detections
                for i, det in enumerate(pred):  # detections per image
                    seen += 1
                    if webcam:  # batch_size >= 1
                        p, im0, _ = path[i], im0s[i].copy(), dataset.count
                        s += f'{i}: '
                    else:
                        p, im0, _ = path, im0s.copy(), getattr(dataset, 'frame', 0)

                    p = Path(p)  # to Path
                    save_path = str(save_dir / p.name)  # im.jpg, vid.mp4, ...
                    s += '%gx%g ' % img.shape[2:]  # print string

                    annotator = Annotator(im0, line_width=1, pil=not ascii)
                    w, h = im0.shape[1],im0.shape[0]
                    if det is not None and len(det):
                        # Rescale boxes from img_size to im0 size
                        det[:, :4] = scale_boxes(
                            img.shape[2:], det[:, :4], im0.shape).round()
                        
                        no_person = 0
                        # Print results
                        for c in det[:, -1].unique():
                            n = (det[:, -1] == c).sum()  # detections per class
                            s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string
                            if (f'{names[int(c)]}' == 'person'):
                                no_person = n
                        
                        print(f"Number of people detected: {no_person}")
                        xywhs = xyxy2xywh(det[:, 0:4])
                        confs = det[:, 4]
                        clss = det[:, 5]
                        # q
                        # if len(self.person_id) == 0:
                        #     if no_person != 0:
                        #         self.seq_array = [[] for _ in range(no_person)]
                        # else:
                        #     self.seq_array = self.sequence
                        
                        # pass detections to deepsort
                        t4 = time_sync()
                        outputs = deepsort.update(xywhs.cpu(), confs.cpu(), clss.cpu(), im0)
                        t5 = time_sync()
                        dt[3] += t5 - t4

                        # temp_person_id = []
                        
                        # if len(outputs) > 0:
                        #     for j, (output, conf) in enumerate(zip(outputs, confs)):
                        #         cls = output[5]
                        #         id = output[4]
                        #         if(f'{names[int(cls)]}' == 'person'):
                        #             print(output[4])        
                        #             temp_person_id.append(id)
                                    
                        #         print(temp_person_id)
                        # draw boxes for visualization
                        if len(outputs) > 0:
                            for j, (output, conf) in enumerate(zip(outputs, confs)):

                                bboxes = output[0:4]
                                id = output[4]
                                cls = output[5]
                                
                                #count
                                c = int(cls)  # integer class
                                label = f'{id} {names[c]} {conf:.2f}'
                                
                                self.count_obj(bboxes,w,h,id)
                                # cnt = 
                                # if(f'{names[int(cls)]}' == 'person'):
                                #     print('person')
                                    
                            
                                    
                                #     crop_img = im0[int(bboxes[1]):int(bboxes[3]), int(bboxes[0]):int(bboxes[2])]
                                
                                #     poseImg, poseResult = pose.mediapipe_detection(crop_img, holistic)
                                #     keypoints = pose.extract_keypoints(poseResult)
                                    
                                #     print(f'self seq:{len(self.sequence)}')
                                    
                                #     if len(self.sequence) == 0:
                                #         # loop 30 times
                                #         for _ in range(30):
                                #             self.sequence.append(keypoints)
                                #     else:
                                #         self.sequence.append(keypoints)
                 
                                #     self.sequence = self.sequence[-30:]
                                #     self.predicted_action = pose.pred_action(self.sequence)
                                    
                                #     print(f'fuuck  {self.predicted_action}')
                                    
                                #     label += f'fuuck  {self.predicted_action}'
                           
                                annotator.box_label(bboxes, label, color=colors(c, True))

                                if self.save_txt:
                                    # to MOT format
                                    bbox_left = output[0]
                                    bbox_top = output[1]
                                    bbox_w = output[2] - output[0]
                                    bbox_h = output[3] - output[1]
                                    # Write MOT compliant results to file
                                    with open(txt_path, 'a') as f:
                                        f.write(('%g ' * 10 + '\n') % (frame_idx + 1, id, bbox_left,  # MOT format
                                                                    bbox_top, bbox_w, bbox_h, -1, -1, -1, -1))

                
                        poseImg, poseResult = pose.mediapipe_detection(im0, holistic)
                        keypoints = pose.extract_keypoints(poseResult)
                        self.sequence.append(keypoints)
                        self.sequence = self.sequence[-30:]
                        
                        if len(self.sequence) == 30:  
                            self.predicted_action = pose.pred_action(self.sequence)
                            text = self.predicted_action
                            cv2.putText(im0, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                        # add text to the top left of the  frame the pred_action
                       
                        
                        LOGGER.info(f'{s}Done. YOLO:({t3 - t2:.3f}s), DeepSort:({t5 - t4:.3f}s)')
                        # print(f'count: {self.count}')

                    else:
                        deepsort.increment_ages()
                        LOGGER.info('No detections')

                    # Stream results
                    im0 = annotator.result()
                    if self.show_vid:
                        LOGGER.info(f'{str(p)}: {self.count}')
                        cv2.imshow(str(p), im0)
                        # ret, buffer = cv2.imencode('.jpg', im0)
                        # frame = buffer.tobytes()
                        # yield (b'--frame\r\n'
                        #         b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                        cv2.waitKey(1)  # 

                    # Save results (image with detections)
                    if self.save_vid:
                        if vid_path != save_path:  # new video
                            vid_path = save_path
                            if isinstance(vid_writer, cv2.VideoWriter):
                                vid_writer.release()  # release previous video writer
                            if vid_cap:  # video
                                fps = vid_cap.get(cv2.CAP_PROP_FPS)
                                w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                                h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                            else:  # stream
                                fps, w, h = 30, im0.shape[1], im0.shape[0]

                            vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
                        vid_writer.write(im0)

        # Print results
        t = tuple(x / seen * 1E3 for x in dt)  # speeds per image
        LOGGER.info(f'Speed: %.1fms pre-process, %.1fms inference, %.1fms NMS, %.1fms deep sort update \
            per image at shape {(1, 3, *imgsz)}' % t)
        if self.save_txt or self.save_vid:
            print('Results saved to %s' % save_path)
            if platform == 'darwin':  # MacOS
                os.system('open ' + save_path)

    def count_obj(self, box,w,h,id):
        center_coordinates = (int(box[0]+(box[2]-box[0])/2) , int(box[1]+(box[3]-box[1])/2))
        if int(box[1]+(box[3]-box[1])/2) > (h -350):
            if  id not in self.data:
                self.count += 1
                self.data.append(id)       

with torch.no_grad():
    track = Track()
    track.run()
