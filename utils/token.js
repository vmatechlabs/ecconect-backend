const jwt = require('jsonwebtoken');
const constants = require('../config/constants');

exports.createAuthToken = (payload) => {
    const token = jwt.sign(
        {
            id: payload.user_id,
            username: payload.username,
            email: payload.UserEmail,
            role: payload.user_role
        },
        constants.auth.accessTokenSecret,
        {
            expiresIn: constants.auth.accessTokenExp
        });
    return token;
};
