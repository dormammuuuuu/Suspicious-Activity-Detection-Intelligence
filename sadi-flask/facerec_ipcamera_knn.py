import cv2
import math
from sklearn import neighbors
import glob
import os
import os.path
import datetime
import pickle
from PIL import Image, ImageDraw
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder
import numpy as np


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'JPG'}


def train(train_dir, model_save_path=None, n_neighbors=None, knn_algo='ball_tree', verbose=True):
    

    # Folder to save text files
    encodings_folder = "encodings/"

    # Create the encodings folder if it doesn't exist
    if not os.path.exists(encodings_folder):
        os.makedirs(encodings_folder)

    # Loop through each person in the training set
    for class_dir in os.listdir(train_dir):
        X = []
        y = []
        if not os.path.isdir(os.path.join(train_dir, class_dir)):
            continue

        txt_file_path = os.path.join(encodings_folder, f"{class_dir}.txt")

        if os.path.exists(txt_file_path):
            if verbose:
                print(f"Skipping folder {class_dir} as text file already exists.")
            # Load existing encodings from the text file
            encodings, labels = load_encodings_from_text(txt_file_path)
            X.extend(encodings)
            y.extend(labels)
            continue

        # Loop through each training image for the current person
        for img_path in image_files_in_folder(os.path.join(train_dir, class_dir)):
            image = face_recognition.load_image_file(img_path)
            face_bounding_boxes = face_recognition.face_locations(image)

            if len(face_bounding_boxes) != 1:
                # If there are no people (or too many people) in a training image, skip the image.
                if verbose:
                    print("Image {} not suitable for training: {}".format(img_path, "Didn't find a face" if len(face_bounding_boxes) < 1 else "Found more than one face"))
            else:
                # Add face encoding for current image to the training set
                X.append(face_recognition.face_encodings(image, known_face_locations=face_bounding_boxes)[0])
                y.append(class_dir)

        # Save face encodings to a text file
        if len(X) > 0:
            save_encodings_to_text(X, y, txt_file_path)

    # Load existing encodings from text files
    for txt_file in os.listdir(encodings_folder):
        txt_file_path = os.path.join(encodings_folder, txt_file)
        if os.path.isfile(txt_file_path):
            encodings, labels = load_encodings_from_text(txt_file_path)
            X.extend(encodings)
            y.extend(labels)

    # Determine how many neighbors to use for weighting in the KNN classifier
    if n_neighbors is None:
        n_neighbors = int(round(math.sqrt(len(X))))
        if verbose:
            print("Chose n_neighbors automatically:", n_neighbors)

    # Create and train the KNN classifier
    knn_clf = neighbors.KNeighborsClassifier(n_neighbors=n_neighbors, algorithm=knn_algo, weights='distance')
    knn_clf.fit(X, y)

    # Save the trained KNN classifier
    if model_save_path is not None:
        with open(model_save_path, 'wb') as f:
            pickle.dump(knn_clf, f)

    return knn_clf



def load_encodings_from_text(file_path):
    encodings = []
    labels = []
    with open(file_path, 'r') as file:
        for line in file:
            encoding_str, label = line.strip().split(':')
            encoding = [float(val) for val in encoding_str.split()]
            encodings.append(encoding)
            labels.append(label)
    return encodings, labels

def save_encodings_to_text(encodings, labels, file_path):
    with open(file_path, 'w') as file:
        for encoding, label in zip(encodings, labels):
            encoding_line = ' '.join(str(val) for val in encoding)
            file.write(f'{encoding_line}:{label}\n')


def predict(X_frame, knn_clf=None, model_path=None, distance_threshold=0.45):
    if knn_clf is None and model_path is None:
        raise Exception("Must supply knn classifier either thourgh knn_clf or model_path")

    # Load a trained KNN model (if one was passed in)
    if knn_clf is None:
        with open(model_path, 'rb') as f:
            knn_clf = pickle.load(f)

    X_face_locations = face_recognition.face_locations(X_frame)

    # If no faces are found in the image, return an empty result.
    if len(X_face_locations) == 0:
        return []

    # Find encodings for faces in the test image
    faces_encodings = face_recognition.face_encodings(X_frame, known_face_locations=X_face_locations)

    # Use the KNN model to find the best matches for the test face
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)
    are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(X_face_locations))]

    # Predict classes and remove classifications that aren't within the threshold
    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in zip(knn_clf.predict(faces_encodings), X_face_locations, are_matches)]


def show_prediction_labels_on_image(frame, predictions):
    pil_image = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil_image)

    for name, (top, right, bottom, left) in predictions:
        # enlarge the predictions for the full sized image.
        top *= 2
        right *= 2
        bottom *= 2
        left *= 2
        # Draw a box around the face using the Pillow module
        draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255))

        # There's a bug in Pillow where it blows up with non-UTF-8 text when using the default bitmap font
        name = name.encode("UTF-8")

        # Draw a label with a name below the face
        text_width, text_height = draw.textsize(name)
        draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
        draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))

    # Remove the drawing library from memory as per the Pillow docs.
    del draw
    # Save image in open-cv format to be able to show it.

    opencvimage = np.array(pil_image)
    return opencvimage

def get_latest_model(model_dir):
    # Get a list of model files in the model_dir
    model_files = glob.glob(os.path.join(model_dir, "*.clf"))

    # Sort the model files by modified time in descending order
    sorted_models = sorted(model_files, key=os.path.getmtime, reverse=True)

    # Return the path of the latest model file
    if sorted_models:
        return sorted_models[0]
    else:
        return None



if __name__ == "__main__":
    print("Starting Face Recognition Module by SADI Team")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    classifier = train("dataset/train", model_save_path=f"models/{timestamp}.clf")

    # Load the latest model from the model_save_dir
    latest_model = get_latest_model('models/')
    print("Loaded model:", latest_model)
    # process one frame in every 30 frames for speed
    process_this_frame = 14
    print('Starting camera...')
    url = 1
    cap = cv2.VideoCapture(url)
    while 1 > 0:
        ret, frame = cap.read()
        if ret:
            # Different resizing options can be chosen based on desired program runtime.
            # Image resizing for more stable streaming
            img = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
            process_this_frame = process_this_frame + 1
            if process_this_frame % 15 == 0:
                predictions = predict(img, model_path=latest_model)
            frame = show_prediction_labels_on_image(frame, predictions)
            cv2.imshow('camera', frame)
            if ord('q') == cv2.waitKey(10):
                cap.release()
                cv2.destroyAllWindows()
                exit(0)