import cv2 as cv
import mediapipe as mp
import numpy as np
import inotify.adapters
import sys
import base64


def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

file_name = sys.argv[1]
# workout = sys.argv[2]
workout="pull-ups"

image = cv.imread(file_name)
cv.imshow("i", image)
cv.waitKey(0)
cv.destroyAllWindows()
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# VIDEO FEED
# cap = cv.VideoCapture(0)

counter = 0
stage = None
# Setup mediapipe instance
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    i = inotify.adapters.Inotify()
    i.add_watch(file_name)

    try:
        for event in i.event_gen():
            if event is not None:
                (header, type_names, watch_path, filename) = event
                frame = cv.imread(file_name)

                # Recolor image to RGB
                image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
                image.flags.writeable = False

                # Make detection
                results = pose.process(image)

                # Recolor back to BGR
                image.flags.writeable = True
                image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

                if workout == "squat":
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
                            sys.stdout.flush()
                    except:
                        pass

                if workout == "pullUp":
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
                            sys.stdout.flush()
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

                cv.imshow('Mediapipe Feed', image)
                cv.waitKey(0)
                cv.destroyAllWindows()


                cv.destroyAllWindows()
    finally:
        i.remove_watch(file_name)
