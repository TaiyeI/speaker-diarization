import cv2
import mediapipe as mp
from pathlib import Path
import os
import numpy as np
import time
import math


CWD_DIR = "/home/tymstr/Documents/GitHub/speaker-diarization/Backend/FacialLandmarks/SpeakingFacesDataset/SubjectOne/"
MOUTH_LANDMARKS = [0, 267, 269, 270, 409, 306, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 185, 40, 39,
                                37]
LIP_LAMDMARKS = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 95, 88, 178, 87, 14, 317, 402, 318, 324, 146, 91, 181, 84, 17, 314, 405, 321, 375]    

All_MOUTH_LANDMARKS = []

def InjestImages(cwd_dir):
    images = []
    for file in os.listdir(cwd_dir):
        filename = os.fsdecode(file)
        images.append(filename)

    arr = np.array(images)

    return np.sort(arr)



mpDraw = mp.solutions.drawing_utils
mpFaceMesh = mp.solutions.face_mesh
faceMesh = mpFaceMesh.FaceMesh(max_num_faces=2)
drawSpec = mpDraw.DrawingSpec(thickness=1, circle_radius=1)


def FindMouth(img, output):
    points = []
    dict = {}
    results = faceMesh.process(img)
    if results.multi_face_landmarks:
        for faceLms in results.multi_face_landmarks:
            # mpDraw.draw_landmarks(img, faceLms, mpFaceMesh.FACEMESH_CONTOURS, drawSpec, drawSpec)
            for id,lm in enumerate(faceLms.landmark):
                image_height, image_width, image_channels = img.shape
                x,y = int(lm.x*image_width), int(lm.y*image_height)
                if id in MOUTH_LANDMARKS:
                    points.append((x,y))
                    dict[id] = (x,y)
    #print(dict)  
    if output == "points":            
        return points
    else:
        return dict

def CalculateDistances(dict):
    newdict = {}
    zero_array = []
    for item, value in dict.items():
            zero_array.append(math.dist(value, dict[0]))
    return zero_array            

def AbsoluteLandmarkRelativeMovement(point):

    return int


def CreateBase():
    img = cv2.imread(CWD_DIR + image_array[0])
    mouthpoints = FindMouth(img, "point")# Return a list of mouth coordinates for a image
    distances = CalculateDistances(mouthpoints)
    return distances



if __name__ == "__main__":
    #calculate movement of 0 over time
    image_array = InjestImages(CWD_DIR) # Return array of files in a directory
    overall_movement = []
    base_points = CreateBase()
    overall_movement = [0]*len(base_points)
    for i in range(len(image_array)):
        img = cv2.imread(CWD_DIR + image_array[1])
        mouthpoints = FindMouth(img, "point")# Return a list of mouth coordinates for a image
        # print("Landmarks:",  mouthpoints)
        distances = CalculateDistances(mouthpoints)
        # print("Distances:", distances)
        for j in range(len(distances)):
            overall_movement[j] += abs(distances[j] - base_points[j])

        # print("Base points:", base_points)
        # print("Distances:",  distances)
    print(overall_movement)
        # for mouthpoint in mouthpoints:
        #     cv2.circle(img, mouthpoint, 1, (255, 0, 0), 1)
        

        # cv2.putText(img, f'Frame: {int(i)}', (20,70), cv2.FONT_HERSHEY_PLAIN,
        #             3, (0,255,0), 3)
        # cv2.imshow("image", img)
        # time.sleep(0.2)
        
        # cv2.waitKey(1)


    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
