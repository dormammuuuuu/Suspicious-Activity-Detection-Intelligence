class SetupUser(MethodView):
    def post(self):
        # get the post data
        post_data = request.get_json()

        # check if user already exists
        user = User.query.filter_by(email=post_data.get('email')).first()
        if user:
            responseObject = {
                'status': 'fail',
                'message': 'User already exists. Please Log in.',
            }
            return make_response(jsonify(responseObject)), 202

        # generate salt and hash password
        salt = bcrypt.gensalt()
        password = bcrypt.hashpw(bytes(post_data['password'], 'utf-8'), salt)

        # create user
        user = User(
            firstname=post_data['firstname'],
            lastname=post_data['lastname'],
            email=post_data['email'],
            number=post_data['number'],
            username=post_data['username'],
            password=password,
            token=config['sadi-config']['uuid'],
            salt=salt
        )

        # insert user to database
        db.session.add(user)
        db.session.commit()

        # generate auth token
        auth_token = user.encode_auth_token(user.id)

        # return success response
        responseObject = {
            'status': 'success',
            'message': 'Setup Complete',
            'auth_token': auth_token.decode()
        }
        return make_response(jsonify(responseObject)), 201
