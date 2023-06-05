import mediapipe as mp
import numpy as np
import cv2
from tensorflow.keras.models import load_model

class Pose:
    def __init__(self, action_model):
            self.action_model = action_model
            self.actions = np.array(['walking', 'standing', 'running', 'punching', 'kicking'])
        
    def mediapipe_detection(self, image, model):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = model.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        return image, results
    
    def extract_keypoints(self, results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
        return pose
    
    def pred_action(self, sequence, threshold=0.5):
        
        # print(self.action_model.summary())
        
        print(np.array(sequence).shape)        
        res = self.action_model.predict(np.expand_dims(sequence, axis=0))[0]
        
        label = 'None'
        if res[np.argmax(res)] > threshold: 
            label = f'{self.actions[np.argmax(res)]} {res[np.argmax(res)]}'
        
        return label
            

