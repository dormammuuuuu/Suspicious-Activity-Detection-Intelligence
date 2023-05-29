import base64
import tempfile
from flask import Flask,  request, redirect, session, Response, send_from_directory, jsonify
from flask_cors import CORS, cross_origin
import os, json, secrets, cv2 as cv, time, shutil, configparser
from urllib.parse import quote
import numpy as np



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
#! pwede tamggalin
app.config['UPLOAD_FOLDER'] = 'users'
# print("appconi", app.config['UPLOAD_FOLDER'])

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST"]}})
app.config['CORS_ORIGIN_ALLOW_ALL'] = True



# The '/api/users/view' route is used to get a list of all the users in the 'users' directory.
@app.route('/api/users/view', methods=['GET'])
def get_users():
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.mkdir(app.config['UPLOAD_FOLDER'])
    users = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify(users)

# The '/api/users/delete' route is used to delete a specific user.
@app.route('/api/users/delete', methods=['POST'])
def delete_user():
    data = request.get_json()
    user = data['name']
    shutil.rmtree("users/{}".format(user))
    return {"status": "success", "message": "User deleted successfully."}

# The '/api/data' route is used to get a json data.
@app.route('/api/data', methods=['GET'])
def get_data():
	data = {'key': 'value'}
	return jsonify(data) 

stop_stream = False



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





# The '/scanner/<user>' route is used to capture face images and detect the faces in the video.

@app.route('/api/scanner/user=<name>&deviceKey=<deviceKey>&width=<width>&height=<height>')
@cross_origin()
def face_capture(name, deviceKey, width, height):    
    cv.destroyAllWindows()
    
    cap = cv.VideoCapture(int(deviceKey), cv.CAP_DSHOW)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, int(width))  # Set the desired width
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, int(height))  # Set the desired height
    should_stop = False
    if not cap.isOpened():
        return jsonify({'cameraStatus': 'Disconnected'})

    def gen_frames(stop):
        detector = FaceDetector()

        img_id = 0
        while not stop:
            success, frame = cap.read()
            # print("success", success)
            # print("img", frame)
            
            if success:
                start = time.time()
                img, bboxs, status = detector.findFaces(frame, start, img_id)
                # Determine face mesh landmarks

                # face_mesh_landmarks = detector.determineFaceMesh(frame)
                # # Do something with the face mesh landmarks...
                # if len(face_mesh_landmarks) > 0:
                #     for landmark_points in face_mesh_landmarks:
                #         for point in landmark_points:
                #             cv.circle(img, point, 2, (0, 255, 0), cv.FILLED)

                if status == 'good':
                    img_id = detector.saveFaces(name, img, bboxs, img_id)

                if img_id == 500:
                    global should_stop
                    should_stop = True;
                    stop = True
                    break

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
    res = Response(response=gen_frames(should_stop), mimetype='multipart/x-mixed-replace; boundary=frame;')
    print("should_stop", should_stop)
    if should_stop:
        cap.release()  # Release the camera capture
        return jsonify({'status': 'Process completed successfully'}) 

    return res

@app.route('/api/get-details/<id>', methods=['get'])
def get_user_details(id):
    user_id = id
    user = read_user("users", user_id)
    if user:
        return jsonify(user)
    return jsonify({"status": "error", "message": "Failed to get user details."})

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


# The '/users/<user>/images' route is used to get a list of all the images of a specific user.
@app.route('/users/<user>/images')
def get_images(user):
    images = os.listdir(app.config['UPLOAD_FOLDER'] + '/' + user)
    return jsonify(images)

@app.route('/users/<user>/<path:filename>')
def serve_image(user, filename):
    print (user, filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'] + '/' + user + '/', filename)

if __name__ == '__main__':
    #? Views
    from views.auth import auth_blueprint     
    app.register_blueprint(auth_blueprint)
    app.run(debug=True)