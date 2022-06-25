import cv2 as cv
import mediapipe as mp
import numpy as np
import sys
import base64
import logging


# import inotify.adapters


def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle


# def decode(base64_string):
#     if isinstance(base64_string, bytes):
#         base64_string = base64_string.decode("utf-8")
#
#     imgdata = base64.b64decode(base64_string)
#     img = skimage.io.imread(imgdata, plugin='imageio')
#     return img

# img_data = sys.argv[1]
# img_data = open('1.txt', 'r')
# image = base64.de(img_data)
image = cv.imread("1.jpg")
cv.imshow("i", image)
cv.waitKey(0)
cv.destroyAllWindows()
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# VIDEO FEED
# cap = cv.VideoCapture(0)

counter = 0
stage = None
file_name = "1.jpg"
workout = ""
# Setup mediapipe instance
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    # i = inotify.adapters.Inotify()
    # i.add_watch(file_name)

    # try:
    #     for event in i.event_gen():
    #         if event is not None:
    #             (header, type_names, watch_path, filename) = event
    frame = cv.imread(file_name)

    # Recolor image to RGB
    image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    image.flags.writeable = False

    # Make detection
    results = pose.process(image)

    # Recolor back to BGR
    image.flags.writeable = True
    image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

    match workout:
        case "squat":
            # Extract landmarks squat
            try:
                landmarks = results.pose_landmarks.landmark

                # get coordinates
                right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
                               landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
                right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
                              landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
                             landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]

                angle = calculate_angle(right_ankle, right_knee, right_hip)

                # Curl counter logic
                if angle < 100:
                    stage = "down"
                    # render detection
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                              mp_drawing.DrawingSpec(color=(120, 200, 80), thickness=2,
                                                                     circle_radius=5),
                                              mp_drawing.DrawingSpec(color=(120, 200, 80), thickness=2,
                                                                     circle_radius=10))

                if angle > 105:
                    # render detection
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                              mp_drawing.DrawingSpec(color=(0, 216, 255), thickness=2,
                                                                     circle_radius=5),
                                              mp_drawing.DrawingSpec(color=(0, 216, 255), thickness=2,
                                                                     circle_radius=10))

                if angle > 105 and stage == 'down':
                    stage = "up"
                    counter += 1
                    print(counter)
            except:
                pass
        case "push-ups":
            # Extract landmarks push-ups
            try:
                landmarks = results.pose_landmarks.landmark

                # Get coordinates
                shoulder_L = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                              landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                elbow_L = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                           landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                wrist_L = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                           landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                shoulder_R = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                              landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                elbow_R = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
                           landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                wrist_R = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
                           landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
                # print(landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].visibility)

                # Calculate angle
                if landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].visibility > 0.8:
                    angle = calculate_angle(shoulder_L, elbow_L, wrist_L)
                if landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].visibility > 0.8:
                    angle = calculate_angle(shoulder_R, elbow_R, wrist_R)

                # Visualize angle
                cv.putText(image, str(angle),
                           tuple(np.multiply(elbow_L, [1280, 720]).astype(int)),
                           cv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv.LINE_AA
                           )

                # Curl counter logic
                if angle > 160:
                    stage = "down"
                if angle < 40 and stage == 'down':
                    stage = "up"
                    counter += 1
                    print(counter)

            except:
                pass
        case "pull-ups":
            # Extract landmark pull-ups
            try:
                landmarks = results.pose_landmarks.landmark
                # Get coordinates
                wrist_L = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                wrist_R = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
                mouth_R = [landmarks[mp_pose.PoseLandmark.MOUTH_RIGHT.value].y]
                # print(landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].visibility)
                # Curl counter logic
                if mouth_R > wrist_R and wrist_L:
                    stage = "down"
                if mouth_R < wrist_R and wrist_L and stage == 'down':
                    stage = "up"
                    counter += 1
                    print(counter)
                if stage == 'down':
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                              mp_drawing.DrawingSpec(color=(28, 149, 51), thickness=2,
                                                                     circle_radius=2),
                                              mp_drawing.DrawingSpec(color=(32, 32, 156), thickness=2,
                                                                     circle_radius=2)
                                              )
                if stage == 'up':
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                              mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2),
                                              mp_drawing.DrawingSpec(color=(0, 0, 0), thickness=2, circle_radius=2)
                                              )
            except:
                pass


    # Render curl counter
    # Setup status box
    cv.rectangle(image, (0, 0), (225, 73), (245, 117, 16), -1)

    # Rep data
    cv.putText(image, 'REPS', (15, 12),
               cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv.LINE_AA)
    cv.putText(image, str(counter),
               (10, 60),
               cv.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv.LINE_AA)

    # Stage data
    cv.putText(image, 'STAGE', (65, 12),
               cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv.LINE_AA)
    cv.putText(image, stage,
               (60, 60),
               cv.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv.LINE_AA)

    # Render detections
    # mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
    #                           mp_drawing.DrawingSpec(color=(28, 149, 51), thickness=2, circle_radius=2),
    #                           mp_drawing.DrawingSpec(color=(32, 32, 156), thickness=2, circle_radius=2)
    #                           )
    cv.imshow('Mediapipe Feed', image)
    cv.waitKey(0)
    cv.destroyAllWindows()
    image.r

    cv.destroyAllWindows()

# finally:
#     i.remove_watch(file_name)
