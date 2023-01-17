from flask import Flask, render_template, request, redirect, session, Response, send_from_directory, jsonify
from flask_cors import CORS
import aiohttp, os, json, secrets, cv2 as cv, time, shutil
from urllib.parse import quote
from classes.face_detector import FaceDetector

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['UPLOAD_FOLDER'] = 'users'

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST"]}})

# The '/setup/process' route is used to process a setup and write the received data to a user.json file.
@app.route("/setup/process", methods=['POST'])
def process():
	with open('user.json', 'w') as f:
		data = request.get_json()
		json.dump(data, f)
	return {"status": "success", "message": "Setup completed successfully."}

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
    print(data)
    user = data['name']
    shutil.rmtree("users/{}".format(user))
    return {"status": "success", "message": "User deleted successfully."}

# The '/api/data' route is used to get a json data.
@app.route('/api/data', methods=['GET'])
def get_data():
	data = {'key': 'value'}
	return jsonify(data) 

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

# The '/logout' route is used to logout and remove the username from the session.
@app.route("/logout")
def logout():
	session.pop('username', None)
	return redirect("/login")

# The '/scanner/<user>' route is used to capture face images and detect the faces in the video.
@app.route('/scanner/<user>')
def face_capture(user):
    cap = cv.VideoCapture(0)
    should_stop = False
    def gen(stop):
        detector = FaceDetector()
        img_id = 0
        status = ''
        while not stop:
            success, img = cap.read()
            start = time.time()
            img, bboxs, status = detector.findFaces(img, start, img_id)

            if status == 'good':
                img_id = detector.saveFaces(user, img, bboxs, img_id)

            if img_id == 500:
                stop = True
                continue
            ret, jpeg = cv.imencode('.jpg', img)
            if not ret:
                break

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

    res = Response(gen(should_stop), mimetype='multipart/x-mixed-replace; boundary=frame')
    if should_stop:
        return redirect('/users')
    return res

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
	app.run(debug=True)