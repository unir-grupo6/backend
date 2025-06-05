const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS } = process.env;

const User = require('../models/users.model');

const getAll = async (req, res) => {
    const users = await User.selectAll();
    res.json(users);
}

const registro = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, Number(BCRYPT_SALT_ROUNDS));
    //TODO: Validar que el email no exista ya en la BBDD
    const result = await User.insert(req.body);
    const newUser = await User.getById(result.insertId);
    res.json(newUser);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.getByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Error in email and/or password' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Error in email and/or password' });
    }
    return res.json({ 
        message: 'Login successful',
        token: jwt.sign({
            user_id: user.id,
            exp: dayjs().add(JWT_EXPIRES_IN_AMOUNT, JWT_EXPIRES_IN_UNIT).unix()
        }, JWT_SECRET_KEY)
    });
}

module.exports = { getAll, registro, login }