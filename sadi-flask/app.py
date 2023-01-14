from flask import Flask, render_template, request, redirect, session, Response, send_from_directory, jsonify
from flask_cors import CORS
import aiohttp, os, json, secrets, cv2 as cv, time, shutil
from urllib.parse import quote
from classes.face_detector import FaceDetector

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['UPLOAD_FOLDER'] = 'users'


CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST"]}})


@app.route("/")
@app.route("/index")
def setup():
	if os.path.exists("user.json"):
		return redirect("/login")
	return redirect("/setup")

@app.route("/setup")
def setup_page():
	return render_template("setup.html")

@app.route("/dashboard")
def dashboard():
	if 'username' not in session:
		return redirect("/login")
	return render_template("dashboard.html")

@app.route("/setup/process", methods=['POST'])
def process():
	with open('user.json', 'w') as f:
		data = request.get_json()
		json.dump(data, f)
	return {"status": "success", "message": "Setup completed successfully."}

# @app.route("/login")
# def login():
# 	if 'username' in session:
# 		return redirect("/dashboard")
# 	error = request.args.get('error') or ''
# 	return render_template('login.html', error=error)

#! REACT SAMPLE LOGIN

@app.route('/api/data', methods=['GET'])
def get_data():
	data = {'key': 'value'}
	return jsonify(data)


@app.route("/login")
def login():
	if 'username' in session:
		return redirect("/dashboard")
	print("login")
	error = request.args.get('error') or ''  
	return {"status": "success", "message": "Setup completed successfully."}

# handle login form submission
@app.route("/authenticate", methods=['POST'])
def auth():
	with open('user.json', 'r') as f:
		data = json.load(f)
		if data['username'] == request.form['username'] and data['password'] == request.form['password']:
			session['username'] = request.form['username']
			return redirect("/dashboard")
		error = "Error: Invalid username or password."
		return redirect("/login?error={}".format(quote(error)))

@app.route("/logout")
def logout():
	session.pop('username', None)
	return redirect("/login")

@app.route("/users")
def users():
	if 'username' not in session:
		return redirect("/login")
	subfolders = [f.name for f in os.scandir("users") if f.is_dir()] or []
	return render_template("users.html", users=subfolders)

@app.route("/user/<user>")
def user(user):
	if 'username' not in session:
		return redirect("/login")
	return render_template("view-images.html", user=user)

@app.route("/user/delete", methods=['POST'])
def delete_user():
	if 'username' not in session:
		return redirect("/login")
	data = request.get_json()
	user = data['name']
	shutil.rmtree("users/{}".format(user))
	return {"status": "success", "message": "User deleted successfully."}

@app.route("/user/add/<user>")
def add_user(user):
	if 'username' not in session:
		return redirect("/login")
	return render_template("register.html", user=user)

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