#!/usr/bin/env python
# coding: utf-8

# In[1]:


import cv2
import numpy as np
import mediapipe as mp

mp_drawing_right = mp.solutions.drawing_utils
mp_drawing_loss  = mp.solutions.drawing_utils
mp_pose          = mp.solutions.pose


# In[ ]:





# In[ ]:





# ## 2. Determing Joints

# <img src='https://i.imgur.com/3j8BPdc.png' style='height:300px'>

# # 3. Calculate Angles

# In[2]:


def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle


# In[ ]:





# In[9]:


cap = cv2.VideoCapture('../squat_example.mp4')

# Curl counter variables
counter = 0 
stage = None

## Setup mediapipe instance
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()
        
        # Recolor image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
      
        # Make detection
        results = pose.process(image)
    
        # Recolor back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Extract landmarks
        try:
            landmarks = results.pose_landmarks.landmark
            
            # get coordinates
            right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
            right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            
            angle = calculate_angle(right_ankle, right_knee, right_hip)
            
            
            cv2.putText(image, str(angle), 
                           tuple(np.multiply(right_knee, [640, 480]).astype(int)), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
                                )
            
             # Curl counter logic
            if angle < 100:
                stage = "down"
                # render detection
                mp_drawing_right.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                  mp_drawing_right.DrawingSpec(color=(120,200,80), thickness=2, circle_radius=5), 
                                  mp_drawing_right.DrawingSpec(color=(120,200,80), thickness=2, circle_radius=10))
                
                
            if angle > 105:
                 # render detection
                mp_drawing_right.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                          mp_drawing_right.DrawingSpec(color=(0,216,255), thickness=2, circle_radius=5), 
                          mp_drawing_right.DrawingSpec(color=(0,216,255), thickness=2, circle_radius=10))          
                 
                
            if angle > 105 and stage =='down':                
                stage="up"
                counter +=1
                print(counter)
        except:
            pass
        
        
         # Render curl counter
        # Setup status box
        cv2.rectangle(image, (0,0), (225,73), (245,117,16), -1)
        
        # Rep data
        cv2.putText(image, 'REPS', (15,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, str(counter), 
                    (10,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)
        
        # Stage data
        cv2.putText(image, 'STAGE', (65,12), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,0), 1, cv2.LINE_AA)
        cv2.putText(image, stage, 
                    (60,60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 2, (255,255,255), 2, cv2.LINE_AA)    
        
        
        cv2.imshow('Mediapipe Feed', image)
       
        key = cv2.waitKey(30) & 0xFF
        if key == 27: 
            break


    cap.release()
    cv2.destroyAllWindows()


# In[ ]:




