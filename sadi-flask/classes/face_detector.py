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
        self.left_line = 150  # X-coordinate of the left line
        self.right_line = 297  # X-coordinate of the right line

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
                ih, iw, ic = image.shape

                bboxC = detection.location_data.relative_bounding_box
                xmin = int(bboxC.xmin * iw - 40)
                ymin = int(bboxC.ymin * ih - 60)
                xmax = int(bboxC.width * iw + 80)
                ymax = int(bboxC.height * ih + 80)

                # Ensure the bounding box coordinates are within the valid range
                xmin = max(0, xmin)
                ymin = max(0, ymin)
                xmax = min(iw, xmax)
                ymax = min(ih, ymax)

                bbox = (xmin, ymin, xmax, ymax)
                
                bboxs.append([id, bbox, detection.score])
           
                        
                image = self.fancyDraw(image, bbox)

                cv.putText(image, f'{int(detection.score[0] * 100)}%',
                        (bbox[0], bbox[1] - 20), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 1)
        else: 
            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
            alpha = 0.7  # Opacity of 70%
            # Add text to the overlay
            self.center_text(overlay, 'Face not', 'detected')
            # Blend the overlay with the original image
            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
            status = 'err'
            
        # cv.rectangle(image, (self.left_line, 30), (self.right_line +24, img_h-30), (0, 255, 0), 2)
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

  
                # print("nose_2d: ", nose_2d)
                nose_x, nose_y = nose_2d[0] , nose_2d[1]
                
                if nose_2d is not None:
                    if (nose_x < self.left_line  or nose_x > self.right_line + 24  or
                            nose_y < 30 or nose_y > img_h - 30):
                        overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                        alpha = 0.7  # Opacity of 70%
                        # Add text to the overlay
                        self.center_text(overlay, 'Please center', 'your face')
                        # Blend the overlay with the original image
                        image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                        status = 'err'
                    elif counter < 100:
                        if ((x > 10 or x < -10) or (y > 10 or y < -10)):
                            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                            alpha = 0.7  # Opacity of 70%
                            self.center_text(overlay, 'Please look at', 'the camera')
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'        
                    elif counter >= 100 and counter < 200:
                        if (x < 10 or (y > 10 or y < -10)):
                            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                            alpha = 0.7  # Opacity of 70%
                            self.center_text(overlay, 'Look up', 'to continue')
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'
                    elif counter >= 200 and counter < 300:
                        if (y < 10):
                            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                            alpha = 0.7  # Opacity of 70%
                            self.center_text(overlay, 'Look right', 'to continue')
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'
                    elif counter >= 300 and counter < 400:
                        if (x > -10 or (y > 10 or y < -10)):
                            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                            alpha = 0.7  # Opacity of 70%
                            self.center_text(overlay, 'Look down', 'to continue')
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'
                    elif counter >= 400 and counter < 500:
                        if (y > -10):
                            overlay = np.ones((img_h, img_w, 3), dtype="uint8") * 255  # Create a white overlay
                            alpha = 0.7  # Opacity of 70%
                            self.center_text(overlay, 'Look left', 'to continue')
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'

                
                end = time.time()
                totalTime = end - start_time
                fps = 1 / totalTime
                # cv.putText(image, f'FPS: {int(fps)}', (20, 50), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)

          

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
    
    def determineFaceMesh(self, img):
            #face_capture > genframes > while > if success > detector.findFaces
                # Determine face mesh landmarks
                # face_mesh_landmarks = detector.determineFaceMesh(frame)
                # # Do something with the face mesh landmarks...
                # if len(face_mesh_landmarks) > 0:
                #     for landmark_points in face_mesh_landmarks:
                #         for point in landmark_points:
                #             cv.circle(img, point, 2, (0, 255, 0), cv.FILLED)

      image = cv.cvtColor(img, cv.COLOR_BGR2RGB)
      
      image.flags.writeable = False

      results = face_mesh.process(image)

      image.flags.writeable = True
      image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

      face_mesh_landmarks = []
      if results.multi_face_landmarks:
         for face_landmarks in results.multi_face_landmarks:
               landmark_points = []
               for landmark in face_landmarks.landmark:
                  x = int((1 - landmark.x) * image.shape[1])  # Flip the X-coordinate
                  y = int(landmark.y * image.shape[0])
                  landmark_points.append((x, y))
               face_mesh_landmarks.append(landmark_points)

      return face_mesh_landmarks
    
    def center_text(self, image, text_top, text_bottom):
        img_h, img_w, img_c = image.shape

        text_top_width = cv.getTextSize(text_top, cv.FONT_HERSHEY_PLAIN, 1.2, 2)[0][0]
        text_top_height = cv.getTextSize(text_top, cv.FONT_HERSHEY_PLAIN, 1.2, 2)[0][1]
        text_bottom_width = cv.getTextSize(text_bottom, cv.FONT_HERSHEY_PLAIN, 1.2, 2)[0][0]
        text_bottom_height = cv.getTextSize(text_bottom, cv.FONT_HERSHEY_PLAIN, 1.2, 2)[0][1]

        center_x = int((img_w - text_top_width) / 2)
        center_y = int((img_h + text_top_height) / 2)

        bottom_center_x = int((img_w - text_bottom_width) / 2)
        bottom_center_y = int((img_h + text_top_height + text_bottom_height) / 2) + 7

        cv.putText(image, text_top, (center_x , center_y), cv.FONT_HERSHEY_PLAIN, 1.2, (0, 0, 0), 2)
        cv.putText(image, text_bottom, (bottom_center_x  , bottom_center_y + 5), cv.FONT_HERSHEY_PLAIN, 1.2, (0, 0, 0), 2)

    
    def saveFaces(self, user, img, bboxs, img_id, width=256, height=256):
        for i in range(len(bboxs)):
            bbox_i = bboxs[i]
            x_i, y_i, w_i, h_i = bbox_i[1]
            imgCrop_i = img[y_i:y_i+h_i, x_i:x_i+w_i]
            imgCrop_i = cv.resize(imgCrop_i, (width, height))

            # Check for overlap with previous bounding boxes
            is_overlap = False
            for j in range(i):
                bbox_j = bboxs[j]
                x_j, y_j, w_j, h_j = bbox_j[1]

                # Calculate the intersection area
                x_overlap = max(0, min(x_i + w_i, x_j + w_j) - max(x_i, x_j))
                y_overlap = max(0, min(y_i + h_i, y_j + h_j) - max(y_i, y_j))
                intersection = x_overlap * y_overlap

                # If there is any intersection, set overlap flag and break the loop
                if intersection > 0:
                    is_overlap = True
                    break

            # Save the image if there is no overlap
            if not is_overlap:
                dirname = f'users/{user}/'
                if not os.path.exists(dirname):
                    os.makedirs(dirname)
                cv.imwrite(f'{dirname}{user}_{img_id}.jpeg', imgCrop_i)
                img_id += 1
        return img_id
    