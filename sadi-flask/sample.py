import cv2
import numpy as np
import os
from matplotlib import pyplot as plt
import time
import mediapipe as mp
import threading
from tensorflow.keras.models import load_model


mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # Image is now writeable 
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results

def draw_styled_landmarks(image, results):
    
    # Draw pose connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                             mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                             mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
                             ) 

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    return pose


model = load_model('weights/action_v5.h5')

actions = np.array(['walking', 'standing', 'running', 'punching', 'kicking'])

colors = [(245, 117, 16), (117, 245, 16), (16, 117, 245), (123, 224, 245), (16, 245, 217)]

def prob_viz(res, actions, input_frame):
    output_frame = input_frame.copy()
    font_scale = 0.8  # Adjust the font scale value to make the font smaller
    for num, prob in enumerate(res):
        
        cv2.rectangle(output_frame, (0, 60 + num * 40), (int(prob * 100), 90 + num * 40), (123, 224, 245), -1)
        cv2.putText(output_frame, actions[num], (0, 85 + num * 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(output_frame, str(round(prob * 100, 2)), (int(prob * 100) + 10, 85 + num * 40), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (123, 224, 245), 2, cv2.LINE_AA)
    return output_frame

from datetime import datetime

# Define the output video file name
output_file = "output.mp4"

# Define the video codec and output parameters
fourcc = cv2.VideoWriter_fourcc(*'MP4V')
fps = 30.0
output_size = (640, 480)

# Create a VideoWriter object to save the frames
out = cv2.VideoWriter(output_file, fourcc, fps, output_size)
# 1. New detection variables
sequence = []
sentence = []
threshold = 0.7

cap = cv2.VideoCapture('test2.mp4')
# Set mediapipe model 
with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    while cap.isOpened():

        # Read feed
        ret, frame = cap.read()
        
        # resize frame to 640x480
        frame = cv2.resize(frame, (640, 480))
        
        # Make detections
        image, results = mediapipe_detection(frame, holistic)
        print(results)
        
        # Draw landmarks
        draw_styled_landmarks(image, results)
        
        # 2. Prediction logic
        keypoints = extract_keypoints(results)

        sequence.append(keypoints)
        sequence = sequence[-30:]
        
        print(len(sequence))
        
        if len(sequence) == 30:
            res = model.predict(np.expand_dims(sequence, axis=0))[0]
            print(f'{res[np.argmax(res)]}')
            print(actions[np.argmax(res)])

            if len(sentence) > 5: 
                sentence = sentence[-5:]

            # Viz probabilities
            image = prob_viz(res, actions, image)
                # Write the frame to the output video file
        out.write(image)
        # Show to screen
        cv2.imshow('OpenCV Feed', image)
        
        # Break gracefully
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        
    cap.release()
    out.release() 
    cv2.destroyAllWindows()