import re

def is_valid_email(email):
    # Regular expression to match an email address
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def setup_validation(data):
    required_fields = list(data.keys())
    error = {}
    for field in required_fields:
        print(data.get(field), field)
        if field not in ('email') and len(data.get(field)) < 3:
            error[field] = f"{field.capitalize()} should be at least 4 characters long."
        if not data.get(field):
            error[field] = f"{field.capitalize()} is required."
        if field == 'email' and not is_valid_email(data.get('email')):
            error['email'] = "Invalid email address"
    return error

def login_validation(data):
    required_fields = list(data.keys())
    error = {}
    for field in required_fields:
        if not data.get(field):
            error[field] = f"{field.capitalize()} is required."
    return error