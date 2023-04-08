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

def get_user(collection, user, password=None):
    try:
        data = mongo.db[collection].find_one(user)
        if data:
            salt = data["salt"]
            hashed_password = data["password"]
            if bcrypt.checkpw(password, hashed_password):
                data["_id"] = str(data["_id"])
                return data
            return None
    except Exception as e:
        return None

    
