from flask_pymongo import PyMongo
from flask import jsonify
import bcrypt
from bson import ObjectId

mongo = PyMongo()

def init_app(app):
    app.config["MONGO_URI"] = "mongodb+srv://dormammu:S3YLkUE7UQsv0GuB@cluster0.3skq370.mongodb.net/user?retryWrites=true&w=majority"
    # app.config["MONGO_URI"] = "mongodb://localhost:27017/SADI"
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
    
def read_user(collection, query):
    try:
        query_id = {"_id": ObjectId(query)}
        data = mongo.db[collection].find_one(query_id)
        if data:
            data["_id"] = str(data["_id"])
            # Convert bytes to string
            for key, value in data.items():
                if isinstance(value, bytes):
                    data[key] = value.decode('utf-8')
            return data
        else:
            return None
    except Exception as e:
        print("read_user error:", e)
        return None
    
def update_user(collection, query, update):
    print("update_user: ", query, update)
    try:
        query_id = {"_id": ObjectId(query)}
        print('query_id: ', query_id)
        update_data = {"$set": update}  # Wrap the update in $set operator to update specific fields
        result = mongo.db[collection].update_one(query_id, update_data)
        if result.modified_count > 0:
            return True
        return False
    except Exception as e:
        print("update_user error:", e)
        return False
    
    
# def update_user(collection, query, update):
#     try:
#         query_id = {"_id": ObjectId(query)}
#         result = mongo.db[collection].update_one(query_id, update)
#         if result.modified_count > 0:
#             return True
#         return False
#     except Exception as e:
#         print("update_user error:", e)
#         return False
    

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
