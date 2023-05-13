from flask_pymongo import PyMongo
from flask import jsonify
import bcrypt

mongo = PyMongo()

def init_app(app):
    app.config["MONGO_URI"] = "mongodb+srv://dormammu:S3YLkUE7UQsv0GuB@cluster0.3skq370.mongodb.net/user?retryWrites=true&w=majority"
    mongo.init_app(app)

def insert_user(collection, user):
    try:
        mongo.db[collection].insert_one(user)
    except Exception as e:
        return jsonify({"status": "error"})
    return jsonify({"status": "success"})

def get_user(collection, query, password=None):
    try:
        data = mongo.db[collection].find_one(query)
        if data:
            salt = data["salt"]
            hashed_password = data["password"]
            if bcrypt.checkpw(password, hashed_password):
                data["_id"] = str(data["_id"])
                return data
            else: 
                return False
        else:
            return None
    except Exception as e:
        return None
    
    


def is_existing_email(collection, email):
    try:
        existing_user = mongo.db[collection].find_one({"email": email})
        if existing_user:
            return True  # Email already exists
        return False
    except Exception as e:
        return False
    
def is_existing_username(collection, username):
    try:
        existing_user = mongo.db[collection].find_one({"username": username})
        if existing_user:
            return existing_user  # Return the found object
        return None  # Username does not exist
    except Exception as e:
        return None
