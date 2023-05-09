from classes.validation import login_validation, setup_validation
from database import get_user, insert_user
from flask import Blueprint, request, current_app
from flask.views import MethodView
import jwt, bcrypt


auth_blueprint = Blueprint('auth', __name__)


# insert user to database
# @app.route("/api/setup", methods=['post'])
class RegisterAPI(MethodView):
   def post(self):
      print("data", request.get_json())
      salt = bcrypt.gensalt()
      data = request.get_json()
      error = setup_validation(data)
      if error:
         return {"status": "error", "error": error}
      user = {
         'firstname': data['firstname'],
         'lastname': data['lastname'],
         'email': data['email'],
         'number': data['number'],
         'username': data['username'],
         'password': bcrypt.hashpw(bytes(data['password'], 'utf-8'), salt),
         'token': current_app.secret_key,
         'salt': salt
      }
      data = insert_user("users", user)
      if data.status == '200 OK':
         return {"status": "success", "message": "Setup Complete"}
      return {"status": "error", "message": "Setup Failed"}

# @app.route("/api/login", methods=['post'])
class LoginAPI(MethodView):
   def post(self):
      data = request.get_json()
      user = {
         'username': data['username'],
      }
      error = login_validation(data)
      if error:
         return {"status": "error", "error": error, "message": ""}

      data = get_user("users", user, bytes(data['password'], 'utf-8'))
      print("data", data)
      if data:
         payload = {'username': data['username'], 'email': data['email']}
         token = jwt.encode(payload, current_app.secret_key, algorithm='HS256')
         return {"status": "success", "message": "Login successful.", "token": token}
      elif data == None:
         error = {"username": "Could'nt find your sadi account."}
      else:
         error = {"password": "Wrong password. Try again or click Forgot password to reset it"}
         
      return {"status": "error", "message": "", "error" : error}



# define the API resources
registration_view = RegisterAPI.as_view('register_api')
login_view = LoginAPI.as_view('login_api')


# add Rules for API Endpoints
auth_blueprint.add_url_rule(
    '/api/setup',
    view_func=registration_view,
    methods=['POST']
)

auth_blueprint.add_url_rule(
    '/api/login',
    view_func=login_view,
    methods=['POST']
)