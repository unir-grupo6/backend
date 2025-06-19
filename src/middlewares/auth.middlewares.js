const jwt = require('jsonwebtoken');

const User = require('../models/users.model');
const { JWT_SECRET_KEY } = process.env;

const checkToken = async (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({ message: 'Authorization header is required' });
    }

    const token = req.headers.authorization;
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    const user = await User.getById(payload.user_id);
    if (!user) {
        return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
}

module.exports = {
    checkToken
};
