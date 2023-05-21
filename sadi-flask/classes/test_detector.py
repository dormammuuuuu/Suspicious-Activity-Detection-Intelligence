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
        self.left_line = 130  # X-coordinate of the left line
        self.right_line = 305  # X-coordinate of the right line
    

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
                # bbox = int(bboxC.xmin * iw - 65), int(bboxC.ymin * ih - 100), \
                #     int(bboxC.width * iw + 130), int(bboxC.height * ih + 130)
                bbox = int(bboxC.xmin * iw - 40), int(bboxC.ymin * ih - 60), \
                    int(bboxC.width * iw + 80), int(bboxC.height * ih + 80)   
                bboxs.append([id, bbox, detection.score])
                image = self.fancyDraw(image, bbox)

                cv.putText(image, f'{int(detection.score[0] * 100)}%',
                        (bbox[0], bbox[1] - 20), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 1)
        cv.rectangle(image, (self.left_line - 10, 20), (self.right_line + 10, img_h-20), (0, 255, 0), 2)
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

  
                print("nose_2d: ", nose_2d)
                nose_x, nose_y = nose_2d[0] , nose_2d[1]
                
                if nose_2d is not None:
                    if (nose_x < self.left_line - 10 or nose_y > self.right_line + 10 or
                            nose_y < 20 or nose_y > img_h - 20):
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
                            # Add text to the overlay
                            self.center_text(overlay, 'Please look at', 'the camera')
                            # Blend the overlay with the original image
                            image = cv.addWeighted(image, 1 - alpha, overlay, alpha, 0)
                            status = 'err'
                    elif counter >= 100 and counter < 200:
                        if (x < 10 or (y > 10 or y < -10)):
                            image = np.zeros((480, 640, 1), dtype="uint8")
                            cv.putText(image, 'Look UP to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                            status = 'err'
                    elif counter >= 200 and counter < 300:
                        if (y < 10):
                            image = np.zeros((480, 640, 1), dtype="uint8")
                            cv.putText(image, 'Look to the RIGHT to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                            status = 'err'
                    elif counter >= 300 and counter < 400:
                        if (x > -10 or (y > 10 or y < -10)):
                            image = np.zeros((480, 640, 1), dtype="uint8")
                            cv.putText(image, 'Look DOWN to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
                            status = 'err'
                    elif counter >= 400 and counter < 500:
                        if (y > -10):
                            image = np.zeros((480, 640, 1), dtype="uint8")
                            cv.putText(image, 'Look to the LEFT to continue', (20, 450), cv.FONT_HERSHEY_PLAIN, 1, (255, 0, 255), 2)
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
    
    

    def saveFaces(self, user, img, bboxs, img_id, width=227, height=227):
        for bbox in bboxs:
            x, y, w, h = bbox[1]
            imgCrop = img[y:y+h, x:x+w]
            imgCrop = cv.resize(imgCrop, (width, height))
            dirname = f'users/{user}/'
            if not os.path.exists(dirname):
                os.makedirs(dirname)
            cv.imwrite(f'{dirname}{user}_{img_id}.jpeg', imgCrop)

        return img_id + 1
        
    def center_text(self, image, text_top, text_bottom):
        img_h, img_w, img_c = image.shape
        print("center_text")
        text = 'Please center'
        text_width = cv.getTextSize(text_top, cv.FONT_HERSHEY_PLAIN, 1, 2)[0][0]
        text_height = cv.getTextSize(text_top, cv.FONT_HERSHEY_PLAIN, 1, 2)[0][1]

        center_x = int(img_w/2) - int(text_width/2)
        center_y = int(img_h/2) + int(text_height/2)

        cv.putText(image, text_top, (center_x, center_y), cv.FONT_HERSHEY_PLAIN, 1.2, (0, 0, 0), 2)
        
        
        bottom_text = 'your face'
        bottom_text_width = cv.getTextSize(text_bottom, cv.FONT_HERSHEY_PLAIN, 1, 2)[0][0]
        bottom_text_height = cv.getTextSize(text_bottom, cv.FONT_HERSHEY_PLAIN, 1, 2)[0][1]

        bottom_center_x = int(img_w/2) - int(bottom_text_width/2)
        bottom_center_y = center_y + int(text_height/2) + int(bottom_text_height/2)

        cv.putText(image, text_bottom, (bottom_center_x, bottom_center_y + 7), cv.FONT_HERSHEY_PLAIN, 1.2, (0, 0, 0), 2)

     
    def runFaceDetection(self):
      # Open the webcam
      cap = cv.VideoCapture(0, cv.CAP_DSHOW)
      cap.set(cv.CAP_PROP_FRAME_WIDTH, 440)  # Set the desired width
      cap.set(cv.CAP_PROP_FRAME_HEIGHT, 256)  # Se

      # Check if the webcam is successfully opened
      if not cap.isOpened():
         print("Failed to open the webcam.")
         exit()

      while True:
         # Read a frame from the webcam
         ret, frame = cap.read()

         if not ret:
               print("Failed to read a frame from the webcam.")
               break

         # Call the findFaces method to detect faces in the frame
         start_time = time.time()
         counter = 0
         draw = True
         result_image, bboxs, status = self.findFaces(frame, start_time, counter, draw)

         # Call the determineFaceMesh method to determine face mesh landmarks
        #  face_mesh_landmarks = self.determineFaceMesh(frame)
        #  # Do something with the face mesh landmarks...
        #  if len(face_mesh_landmarks) > 0:
        #        for landmark_points in face_mesh_landmarks:
        #           for point in landmark_points:
        #              cv.circle(result_image, point, 2, (0, 255, 0), cv.FILLED)
                     
         # Display the resulting image
         cv.imshow('Face Detection', result_image)

         # Check if the 'q' key is pressed to exit the loop
         if cv.waitKey(1) == ord('q'):
               break

      # Release the webcam and close any open windows
      cap.release()
      cv.destroyAllWindows()
     

# Create an instance of the FaceDetector class
detector = FaceDetector()

# Run the face detection and face mesh determination
detector.runFaceDetection()   



# import cv2
    
    
# def list_ports():
#     """
#     Test the ports and returns a tuple with the available ports and the ones that are working.
#     """
#     non_working_ports = []
#     dev_port = 0
#     working_ports = []
#     available_ports = []
#     while len(non_working_ports) < 6: # if there are more than 5 non working ports stop the testing. 
#         camera = cv2.VideoCapture(dev_port)
#         if not camera.isOpened():
#             non_working_ports.append(dev_port)
#             print("Port %s is not working." %dev_port)
#         else:
#             is_reading, img = camera.read()
#             w = camera.get(3)
#             h = camera.get(4)
#             if is_reading:
#                 print("Port %s is working and reads images (%s x %s)" %(dev_port,h,w))
#                 working_ports.append(dev_port)
#             else:
#                 print("Port %s for camera ( %s x %s) is present but does not reads." %(dev_port,h,w))
#                 available_ports.append(dev_port)
#         dev_port +=1
#     return available_ports,working_ports,non_working_ports
 
 

# print(list_ports())



# import cv2

# def get_camera_details():
#     # Get the list of available camera indexes
#     camera_indexes = list(range(0, 10))
#     camera_details = []

#     for index in camera_indexes:
#         # Try to open the camera with DirectShow backend
#         capture = cv2.VideoCapture(index, cv2.CAP_DSHOW)
#         if capture.isOpened():
#             # Read camera ID and label
#             capture.set(cv2.CAP_PROP_POS_MSEC, 0)
#             ret, frame = capture.read()
#             if ret:
#                 camera_size = f"{frame.shape[1]}x{frame.shape[0]}"
#             else:
#                 camera_size = "Unknown"

#             # Store camera details
#             camera_info = {
#                 'index': index,
#                 'camera_size': camera_size,
#             }
#             camera_details.append(camera_info)

#             # Release the camera capture
#             capture.release()

#     return camera_details

# # Call the function to get the camera details
# details = get_camera_details()

# # Print the camera details
# for camera_info in details:
#     print(f"Camera Index: {camera_info['index']}")
#     print(f"Camera Size: {camera_info['camera_size']}")
#     # print(f"Camera Label: {camera_info['label']}")
#     print()


# import cv2

# cap = cv2.VideoCapture(1)

# while True:
#     ret, frame = cap.read()
#     if ret:
#         camera_id = f"{frame.shape[1]}x{frame.shape[0]}"
#         print(camera_id)

#     cv2.imshow('Webcam', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()