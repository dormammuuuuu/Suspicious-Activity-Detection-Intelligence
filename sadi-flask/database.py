from flask_pymongo import PyMongo
from flask import jsonify

mongo = PyMongo()

def init_app(app):
    app.config["MONGO_URI"] = "mongodb+srv://dormammu:CMPQhE2xFlGreLsU@cluster0.3skq370.mongodb.net/user?retryWrites=true&w=majority"
    mongo.init_app(app)

def insert_user(collection, item):
    try:
        mongo.db[collection].insert_one(item)
    except Exception as e:
        return jsonify({"error": "Failed creating"})
    return jsonify({"message": "Item created successfully"})