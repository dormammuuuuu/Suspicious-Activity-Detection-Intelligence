import cv2 as cv
import mediapipe as mp
import numpy as np
import time
import os

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils
faceDetection = mp.solutions.face_detection.FaceDetection(0.75)

class FaceDetector():
    def __init__(self, minDetectionCon=0.5):
        self.midDetectionCon = minDetectionCon
        self.mpFaceDetection = mp.solutions.face_detection
        self.mpDraw = mp.solutions.drawing_utils
        self.mpFaceDetection = self.mpFaceDetection.FaceDetection(minDetectionCon)

    def findFaces(self, img, start_time, counter, draw=True):
        # Flip the image horizontally for a later selfie-view display
        # Also convert the color space from BGR to RGB
        image = cv.cvtColor(cv.flip(img, 1), cv.COLOR_BGR2RGB)
        status = 'good'
        # To improve performance
        image.flags.writeable = False
        
        # Get the result
        results = face_mesh.process(image)
        results2 = faceDetection.process(image)
        
        # To improve performance
        image.flags.writeable = True
        
        # Convert the color space from RGB to BGR
        image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

        img_h, img_w, img_c = image.shape
        face_3d = []
        face_2d = []
        bboxs = []

        if results2.detections:
            for id, detection in enumerate(results2.detections):
                # print(detection.location_data.relative_bounding_box)
                ih, iw, ic = image.shape

                bboxC = detection.location_data.relative_bounding_box
                bbox = int(bboxC.xmin * iw - 65), int(bboxC.ymin * ih - 100), \
                    int(bboxC.width * iw + 130), int(bboxC.height * ih + 130)
                bboxs.append([id, bbox, detection.score])
                image = self.fancyDraw(image, bbox)

                cv.putText(image, f'{int(detection.score[0] * 100)}%',
                           (bbox[0], bbox[1] - 20), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 1)

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                for idx, lm in enumerate(face_landmarks.landmark):
                    if idx == 33 or idx == 263 or idx == 1 or idx == 61 or idx == 291 or idx == 199:
                        if idx == 1:
                            nose_2d = (lm.x * img_w, lm.y * img_h)
                            nose_3d = (lm.x * img_w, lm.y * img_h, lm.z * 3000)

                        x, y = int(lm.x * img_w), int(lm.y * img_h)

                        # Get the 2D Coordinates
                        face_2d.append([x, y])

                        # Get the 3D Coordinates
                        face_3d.append([x, y, lm.z])       
                
                # Convert it to the NumPy array
                face_2d = np.array(face_2d, dtype=np.float64)

                # Convert it to the NumPy array
                face_3d = np.array(face_3d, dtype=np.float64)

                # The camera matrix
                focal_length = 1 * img_w

                cam_matrix = np.array([ [focal_length, 0, img_h / 2],
                                        [0, focal_length, img_w / 2],
                                        [0, 0, 1]])

                # The distortion parameters
                dist_matrix = np.zeros((4, 1), dtype=np.float64)

                # Solve PnP
                success, rot_vec, trans_vec = cv.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)

                # Get rotational matrix
                rmat, jac = cv.Rodrigues(rot_vec)

                # Get angles
                angles, mtxR, mtxQ, Qx, Qy, Qz = cv.RQDecomp3x3(rmat)

                # Get the y rotation degree
                x = angles[0] * 360
                y = angles[1] * 360
                z = angles[2] * 360

                if counter < 100:
                    if ((x > 10 or x < -10) or (y > 10 or y < -10)):
                        image = np.zeros((480, 640, 1), dtype = "uint8")
                        cv.putText(image, 'Please look at the camera', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                        status = 'err'
                elif counter >= 100 and counter < 200:
                    if (x < 10 or (y > 10 or y < -10)):
                        image = np.zeros((480, 640, 1), dtype = "uint8")
                        cv.putText(image, 'Look UP to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                        status = 'err'
                elif counter >= 200 and counter < 300:
                    if (y < 10):
                        image = np.zeros((480, 640, 1), dtype = "uint8")
                        cv.putText(image, 'Look to the RIGHT to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                        status = 'err'
                elif counter >= 300 and counter < 400:
                    if (x > -10 or (y > 10 or y < -10)):
                        image = np.zeros((480, 640, 1), dtype = "uint8")
                        cv.putText(image, 'Look DOWN to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                        status = 'err'
                elif counter >= 400 and counter < 500:
                    if (y > -10):
                        image = np.zeros((480, 640, 1), dtype = "uint8")
                        cv.putText(image, 'Look to the LEFT to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                        status = 'err'

                
                end = time.time()
                totalTime = end - start_time
                fps = 1 / totalTime
                cv.putText(image, f'FPS: {int(fps)}', (20, 50), cv.FONT_HERSHEY_PLAIN, 2, (255, 0, 255), 2)

        return image, bboxs, status

    def fancyDraw(self, img, bbox, l=15, t=3):
        x, y, w, h = bbox
        x1, y1 = x + w, y + h

        cv.rectangle(img, bbox, (255, 0, 255), 2)

        # Top Left x,y
        cv.line(img, (x, y), (x + l, y), (255, 0, 255), t)
        cv.line(img, (x, y), (x, y+l), (255, 0, 255), t)

        # Top Right x1,y
        cv.line(img, (x1, y), (x1 - l, y), (255, 0, 255), t)
        cv.line(img, (x1, y), (x1, y+l), (255, 0, 255), t)

        # Bottom Left x,y1
        cv.line(img, (x, y1), (x + l, y1), (255, 0, 255), t)
        cv.line(img, (x, y1), (x, y1-l), (255, 0, 255), t)

        # Bottom Right x1,y1
        cv.line(img, (x1, y1), (x1 - l, y1), (255, 0, 255), t)
        cv.line(img, (x1, y1), (x1, y1-l), (255, 0, 255), t)

        return img

    def saveFaces(self, user, img, bboxs, img_id, width=227, height=227):
        for bbox in bboxs:
            x, y, w, h = bbox[1]
            imgCrop = img[y:y+h, x:x+w]
            imgCrop = cv.resize(imgCrop, (width, height))
            dirname = f'users/{user}/'
            if not os.path.exists(dirname):
                os.makedirs(dirname)
            cv.imwrite(f'{dirname}{user}_{img_id}.jpeg', imgCrop)

        print('Faces saved')
        return img_id + 1