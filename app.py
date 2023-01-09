from flask import Flask, render_template, request, redirect, session, Response
import aiohttp, os, json, secrets, cv2 as cv, time
from urllib.parse import quote
from classes.face_detector import FaceDetector

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

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

@app.route("/login")
def login():
	if 'username' in session:
		return redirect("/dashboard")
	error = request.args.get('error') or ''
	return render_template('login.html', error=error)

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

@app.route("/test")
def test():
	return render_template("register.html")

@app.route('/scanner')
def face_capture():
    # Create a VideoCapture object
    cap = cv.VideoCapture(0)

    def gen():
        detector = FaceDetector()
        img_id = 0
        status = ''
        while True:
            success, img = cap.read()
            start = time.time()
            img, bboxs, status = detector.findFaces(img, start, img_id)

            # save image
            if status == 'good':
                img_id = detector.saveFaces("Test", img, bboxs, img_id)

            # Encode the frame as a JPEG image
            ret, jpeg = cv.imencode('.jpg', img)

            # Check if the encoding was successful
            if not ret:
                break
            # Yield the encoded frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

    # Set the response headers and return the response
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
	app.run(debug=True)