
import secrets
import string
from bson import ObjectId
from flask import Blueprint, request, current_app, jsonify
import jwt, bcrypt
from datetime import datetime, timedelta
import requests
from flask_mail import Message, Mail


from classes.validation import login_validation, setup_validation, forgot_password_validation, reset_password_validation
from database import get_user, insert_user, is_existing_username, update_user
from flask.views import MethodView




auth_blueprint = Blueprint('auth', __name__)



def generate_verification_code():
      # Generate a unique verification code with 6 characters
    characters = string.ascii_uppercase + string.digits  # Use uppercase letters and digits
    code = ''.join(secrets.choice(characters) for _ in range(6))
    return code


def send_email_verification_code(email, verification_code):
   mail = Mail(current_app)
 
   subject = "Email Verification Code"
   sender = "noreply@sadi.com"
   email = "johnangelo.silvestre@tup.edu.ph"
   try:
      msg = Message(subject, sender=sender, recipients=[email])
      msg.body = f'Hello! Your verification code is: {verification_code}'
      mail.send(msg)
      return True
   except Exception as e:
      error = str(e)
      print(f"An error occurred while sending the email: {str(e)}")
      return error

class RegisterAPI(MethodView):
   def post(self):
      # print("data", request.get_json())
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
      # print("data", data)
      if data:
         payload = {'username': data['username'], 'email': data['email']}
         token = jwt.encode(payload, current_app.secret_key, algorithm='HS256')
         return {"status": "success", "message": "Login successful.", "token": token}
      elif data == None:
         error = {"username": "Could'nt find your sadi account."}
      else:
         error = {"password": "Wrong password. Try again or click Forgot password to reset it"}
         
      return {"status": "error", "message": "", "error" : error}
   
   


class ForgotPasswordAPI(MethodView):
   def post(self):
      
      data = request.get_json()
      username = data['username']
      error = forgot_password_validation(data)
      if error:
         return {"status": "error", "error": error, "message": ""}
      data = is_existing_username("users", username)
      if data:
         
         payload = {'email': data['email']}
         token = jwt.encode(payload, current_app.secret_key, algorithm='HS256')
         
         expiration_time = datetime.utcnow() + timedelta(minutes=5)
         verification_code = generate_verification_code() 
         print("verification_code", verification_code)
            
         isEmailSent = send_email_verification_code(data['email'], verification_code)
         
         if isEmailSent:
            return jsonify({
               "id": str(data['_id']),
               "status": "success",
               "email": data["email"],
               "token": token,
               "exp": expiration_time,
               "verification_code": verification_code
            })
         else:
           return jsonify({"status": "error", "error": isEmailSent['error']})
      else:
         error = {"username": "Couldn't find your sadi account."}
         return {"status": "error", "message": "", "error": error}
      
class confirmCodeAPI(MethodView):
   def post(self):
      data = request.get_json()
      print("data", data)
      if 'remaining_seconds' in data and data['remaining_seconds'] <= 0:
         error = {"code": "The verification code has expired. Please request a new one.",  "remaining_seconds": data['remaining_seconds']}
         return {"status": "error", "message": "", "error": error}
      elif 'user_verification_code' not in data or data['user_verification_code'] == '':
         error = {"code": "Please enter the verification code.",  "remaining_seconds": data['remaining_seconds']}
         return {"status": "error", "message": "", "error": error}
      elif data['user_verification_code'] == data['verification_code']:
         return {"status": "success", "message": "Verification successful."}
      else:
         error = {"code": "Invalid verification code.",  "remaining_seconds": data['remaining_seconds']}
         return {"status": "error", "message": "", "error": error}
     


class resedCodeAPI(MethodView):
   def post(self):
      data = request.get_json()
      print("data", data)
      payload = {'email': data['email']}
      token = jwt.encode(payload, current_app.secret_key, algorithm='HS256')
      print("data", data)
      expiration_time = datetime.utcnow() + timedelta(minutes=5)
      verification_code = generate_verification_code() 
      print("verification_code", verification_code)
         
      isEmailSent = send_email_verification_code(data['email'], verification_code)
      if isEmailSent:
         return jsonify({
            "status": "success",
            "email": data["email"],
            "token": token,   
            "exp": expiration_time,
            "verification_code": verification_code
         })
      else:
         return jsonify({"status": "error", "error": isEmailSent['error']})
      
      
class ResetPasswordAPI(MethodView):
   def post(self):
      data = request.get_json()
      salt = bcrypt.gensalt()
      print("data", data)
      error = reset_password_validation(data)
      if error:
         return {"status": "error", "error": error}
      
      query = {'_id': ObjectId(data['id'])}
      update = {'$set': {
         'password': bcrypt.hashpw(bytes(data['new_password'], 'utf-8'), salt),
         'salt': salt
      }}
      updated_user = update_user("users", query, update)
      
      if updated_user:
         return {"status": "success", "message": "Password reset successful."}
      
      return {"status": "error", "message": "Reset password failed."}
     

# define the API resources
registration_view = RegisterAPI.as_view('register_api')
login_view = LoginAPI.as_view('login_api')
forgot_password_view = ForgotPasswordAPI.as_view('forgot_password_api')
confirm_code_view = confirmCodeAPI.as_view('confirm_code_api')
resend_code_view = resedCodeAPI.as_view('resend_code_api')
reset_password_view = ResetPasswordAPI.as_view('reset_password_api')


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
auth_blueprint.add_url_rule(
      '/api/forgot-password',
      view_func=forgot_password_view,
      methods=['POST'],
)
auth_blueprint.add_url_rule(
   '/api/confirm-code',
   view_func=confirm_code_view,
   methods=['POST']
)
auth_blueprint.add_url_rule(
   '/api/resend-code',
   view_func=resend_code_view,
   methods=['POST']
)
auth_blueprint.add_url_rule(
   '/api/reset-password',
   view_func=reset_password_view,
   methods=['POST']
)









