const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

const getAll = async (req, res) => {
    const users = await User.selectAll();
    res.json(users);
}



module.exports = { getAll }