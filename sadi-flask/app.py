import base64
import random
import tempfile
from flask import Flask,  request, redirect, send_file, session, Response, send_from_directory, jsonify, url_for
from flask_cors import CORS, cross_origin
import os, json, secrets, cv2 as cv, time, shutil, configparser
from urllib.parse import quote
import numpy as np
import asyncio
import datetime

from facerec_module import train
from database import init_app
from yolov5.detect import run
from classes.face_detector import FaceDetector
from classes.utils import get_available_camera_details
from database import read_user, update_user
#? Views
from views.auth import auth_blueprint



app = Flask(__name__)
init_app(app)
# Config
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'sad.intelligence@gmail.com'
app.config['MAIL_PASSWORD'] = 'ktykxsnyxxxxwodu' # On Allow less secure app in gmail manage settings

# mail = Mail(app)

should_stop = False

# # Initialize the YOLOv5 Detector
# yoloLiveStream = Detect()


if not os.path.exists('user.ini'):
    # Create a config file to create a uuid for the user
    config = configparser.ConfigParser()
    config['sadi-config'] = {'uuid': secrets.token_hex(16)}
    # Writing the configuration file to 'example.ini'
    with open('user.ini', 'w') as configfile:
        config.write(configfile)
else:
    config = configparser.ConfigParser()
    config.read('user.ini')

app.secret_key = config['sadi-config']['uuid']

app.config['UPLOAD_FOLDER'] = 'users'
# print("appconi", app.config['UPLOAD_FOLDER'])

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST"]}})
app.config['CORS_ORIGIN_ALLOW_ALL'] = True
    


# The '/api/data' route is used to get a json data.
@app.route('/api/data', methods=['GET'])
def get_data():
	data = {'key': 'value'}
	return jsonify(data) 

@app.route('/api/video_feed')
def video_feed():
    timestamp = request.args.get('ts')
    if timestamp:
        if int(timestamp) == int(time.time()):
            return "Video already running", 200
    global stop_stream
    stop_stream = False 

    cap = cv.VideoCapture(0)
    if not cap.isOpened():
        return Response("Error opening video stream", status=500)
    
    def generate():
        while cap.isOpened() and not stop_stream:
            ret, frame = cap.read()
            if not ret:
                break
            ret, jpeg = cv.imencode('.jpg', frame)
            if not ret:
                continue
            frame = jpeg.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
    return Response(generate(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/stop_video_feed')
def stop_video_feed():
    global stop_stream
    stop_stream = True
    return "Video stream stopped"


# def video_inference():
#     result_frame = detect.detect() # detect objects in the frame
#     # ret, buffer = cv.imencode('.jpg', result_frame)
#     # frame = buffer.tobytes()
#     # yield (b'--frame\r\n'
#     #         b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') 

@app.route('/api/yolov5', methods=['GET'])
def inference():
    print('inference')
    result = run()  # Call the run() function to get the result
    return Response(result, mimetype='multipart/x-mixed-replace; boundary=frame')

# The '/authenticate' route is used to handle login form submission and checks the credentials with the data in user.json file.
@app.route("/authenticate", methods=['POST'])
def auth():
	with open('user.json', 'r') as f:
		data = json.load(f)
		if data['username'] == request.form['username'] and data['password'] == request.form['password']:
			session['username'] = request.form['username']
			return redirect("/dashboard")
		error = "Error: Invalid username or password."
		return redirect("/login?error={}".format(quote(error)))


@app.route('/api/get_available_camera', methods=['GET'])
def get_available_camera():
    devices_size = get_available_camera_details()

    return jsonify(devices_size)



should_stop = False
@app.route('/api/get-recognition-status', methods=['GET'])
def get_recognition_status():
    global should_stop
    print (should_stop)
    if should_stop:
        asyncio.run(train_new_face())
    return jsonify({'status': should_stop})

# The '/scanner/<user>' route is used to capture face images and detect the faces in the video.
@app.route('/api/scanner/user=<name>&deviceKey=<deviceKey>&width=<width>&height=<height>')
@cross_origin()
def face_capture(name, deviceKey, width, height):    
    cv.destroyAllWindows()
    
    cap = cv.VideoCapture(int(deviceKey), cv.CAP_DSHOW)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, int(width))  # Set the desired width
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, int(height))  # Set the desired height
    if not cap.isOpened():
        return jsonify({'cameraStatus': 'Disconnected'})
    print("cap", cap)

    def gen_frames():
        global should_stop  # Declare should_stop as global before using it
        should_stop = False  # Set should_stop to False initially
        detector = FaceDetector()

        img_id = 0
        while not should_stop:
            success, frame = cap.read()
            # print("success", success)
            # print("img", frame)
            
            if success:
                start = time.time()
                img, bboxs, status = detector.findFaces(frame, start, img_id)
            
                if status == 'good':
                    img_id = detector.saveFaces(name, img, bboxs, img_id)

                if img_id == 500:
                    cap.release()  # Release the camera capture
                    should_stop = True
                    
                    return jsonify({'status': 'Process completed successfully'}) 

                ret, jpeg = cv.imencode('.jpg', img)
                if not ret:
                    break
                
                # Yield the frame response to the client
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
                # return jsonify(frame_response)
            else:
                app.logger.error("Failed to capture frame from the camera")
                yield jsonify({'statusCamera': 'Failed'})
                
                break
    res = Response(response=gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame;')
    return res

@app.route('/api/get-details/<id>', methods=['get'])
def get_user_details(id):
    user_id = id
    user = read_user("users", user_id)
    if user:
        return jsonify(user)
    return jsonify({"status": "error", "message": "Failed to get user details."})



# Used to train the model with the captured face images.
async def train_face():
    print ("Training face")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    classifier = train("users", model_save_path=f"models/{timestamp}.clf")

async def train_new_face():
    task = asyncio.create_task(train_face())
    await task

@app.route('/api/update-details/<id>', methods=['POST'])
def update_user_details(id):
    try:
        user_id = id
        update_data = request.json  # Assuming you're using Flask's request object to get the update data

        # Prepare the update document
        update = {
            "firstname": update_data.get("firstname"),
            "lastname": update_data.get("lastname"),
            "username": update_data.get("username"),
            "email": update_data.get("email"),
            "number": update_data.get("number")
        }

        result = update_user("users", user_id, update)

        if result:
            return jsonify({"status": "success", "message": "User details updated successfully."})
        else:
            return jsonify({"status": "error", "message": "Failed to update user details."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})



# The '/api/users/view' route is used to get a list of all the users in the 'users' directory.
@app.route('/api/users/view', methods=['GET'])
def get_users():
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.mkdir(app.config['UPLOAD_FOLDER'])
    users = os.listdir(app.config['UPLOAD_FOLDER'])
    user_data = []

    for user in users:
        user_images = os.listdir(app.config['UPLOAD_FOLDER'] + '/' + user)
        if user_images:
            random.shuffle(user_images)  # Randomize the image list
            image_path = app.config['UPLOAD_FOLDER'] + '/' + user + '/' + user_images[0]
            user_data.append({
                'name': user,
                'image': image_path
            })

    return jsonify(user_data)

# The '/api/users/delete' route is used to delete specific users.
@app.route('/api/users/delete', methods=['POST'])
def delete_users():
    data = request.get_json()
    users = data['names']
    
    for user in users:
        shutil.rmtree("users/{}".format(user))
        os.remove("encodings/{}.txt".format(user))  
    
    # Check if there are files to be trained
    if len(os.listdir("users/")) > 0 and len(os.listdir("encodings/")) > 0:
        asyncio.run(train_face()) # Retrain model after deleting
    
    return {"status": "success", "message": "Users deleted successfully."}  

    

@app.route('/users/<user>/<path:filename>')
def serve_image(user, filename) :
    # print (user, filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'] + '/' + user + '/', filename)


@app.route('/api/view-history/get-folders', methods=['GET'])
def get_folders():
    folder_path = './yolov5/runs-playback'
    folders = []

    try:
        # Get the list of folders in the specified directory
        folder_names = next(os.walk(folder_path))[1]
        
        # Iterate over the folder names and retrieve additional information
        for folder_name in folder_names:
            folder_id = folder_name  # Extract the folder ID from the name
            date_created = os.path.getctime(os.path.join(folder_path, folder_name))  # Get the folder creation date
            
            folders.append({
                'id': folder_id,
                'name': folder_name,
                'date_created': date_created
            })
            
        # print(folders)
    except Exception as e:
        # Handle any exceptions that may occur during the retrieval of folder names
        return jsonify({'error': str(e)}), 500

    return jsonify({'folders': folders}), 200


@app.route('/api/view-history/get-folders/<folder_name>', methods=['GET'])
def get_folder_images(folder_name):
    folder_path = f'./yolov5/runs-playback/{folder_name}'

    try:
        # Get the list of image files in the specified folder
        image_files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    except Exception as e:
        # Handle any exceptions that may occur during the retrieval of image files
        return jsonify({'error': str(e)}), 500

    return jsonify({'images': image_files}), 200


@app.route('/api/view-history/get-folders/<folder_name>/<image_file>', methods=['GET'])
def get_image(folder_name, image_file):
    folder_path = f'./yolov5/runs-playback/{folder_name}'

    try:
        # Serve the requested image file from the specified folder
        return send_from_directory(folder_path, image_file)
    except Exception as e:
        # Handle any exceptions that may occur during the image retrieval
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    #? Views
    from views.auth import auth_blueprint     
    app.register_blueprint(auth_blueprint)
    app.run(debug=True)