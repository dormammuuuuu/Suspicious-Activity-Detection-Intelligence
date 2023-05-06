import re, bcrypt 
from database import is_existing_email, is_existing_username, get_user 

# def is_valid_email(email):
#     # Regular expression to match an email address
#     pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
#     return re.match(pattern, email) is not None

# def setup_validation(data):
#     required_fields = list(data.keys())
#     error = {}
#     for field in required_fields:
#         print(data.get(field), field)
#         if field not in ('email') and len(data.get(field)) < 3:
#             error[field] = f"{field.capitalize()} should be at least 4 characters long."
#         if not data.get(field):
#             error[field] = f"{field.capitalize()} is required."
#         if field == 'email' and not is_valid_email(data.get('email')):
#             error['email'] = "Invalid email address"
#     return error




def is_valid_email(email):
    # Regular expression to match an email address
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def is_valid_mobile_number(mobile_number):
    # Regular expression to match a mobile number with 11 digits and starts with '09'
    pattern = r"^09[0-9]{9}$"
    return re.match(pattern, mobile_number) is not None

def is_valid_password(password):
    # Regular expression to match a password with at least 8 characters, 
    # one uppercase letter, one lowercase letter, and one number
    pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
    return re.match(pattern, password) is not None

def setup_validation(data):
    required_fields = list(data.keys())
    error = {}
    for field in required_fields:
        value = data.get(field)
        if not value:
            error[field] = f"{field.capitalize()} is required."
        elif field == 'firstname':
            if len(value) < 2:
                error[field] = f"{field.capitalize()} should be at least 2 characters long."
            elif not re.match(r"^[A-Za-z\s]+$", value):
                error[field] = f"{field.capitalize()} should contain only letters and spaces."
        elif field == 'lastname':
            if len(value) < 2:
                error[field] = f"{field.capitalize()} should be at least 2 characters long."
            elif not re.match(r"^[A-Za-z\s]+$", value):
                error[field] = f"{field.capitalize()} should contain only letters and spaces."
        elif field == 'username':
            if len(value) < 4:
                error[field] = f"{field.capitalize()} should be at least 4 characters long."
            elif  not re.match(r"^\w+$", value):
                error[field] = f"Invalid username. Allowed characters (a-z, A-Z, 0-9, _)."
            elif is_existing_username('users', value):
                error[field] = "Username already registered."
        elif field == 'email':
            if not is_valid_email(value):
                error[field] = "Invalid email address."
            elif is_existing_email('users', value):
                error[field] = "Email address already registered."
        elif field == 'number':
            if not is_valid_mobile_number(value):
                error[field] = "Please provide a valid number."
        elif field == 'password':
            if not is_valid_password(value):
                error[field] = "Password should have at least 8 characters, one uppercase letter, one lowercase letter, and one number."
        elif field == 'confirmpassword':
            if value != data.get('password'):
                error[field] = "Passwords do not match."
        # else:
        #     if len(value) < 2:
        #         error[field] = f"{field.capitalize()} should be at least 2 characters long."
    return error

def login_validation(data, userNameQuery):
    required_fields = list(data.keys())
    error = {}
    for field in required_fields:
        if not data.get(field):
            error[field] = f"{field.capitalize()} is required."
            
    # username = data.get('username')
    # password = data.get('password')
    

    # print("user", userNameQuery)
    # # Check if user exists in MongoDB
    # data = get_user("users", userNameQuery, bytes(password, 'utf-8'))
    # print("user_doc", data)
    # if not data:
    #     error['username'] = "Username not found."
    # else:
    #     # Check if password is correct
    #     if not check_password_hash(user_doc['password'], password):
    #         error['password'] = "Invalid password."
    
    return error