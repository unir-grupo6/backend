const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { transporter, sendResetPasswordEmail } = require('../config/mailer');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_RESET_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_RESET_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS, FRONTEND_URL } = process.env;

const User = require('../models/users.model');

const getById = async (req, res) => {
    req.user.fecha_nacimiento = dayjs(req.user.fecha_nacimiento).format('YYYY-MM-DD');
    req.user.fecha_alta = dayjs(req.user.fecha_alta).format('YYYY-MM-DD');
    res.json(req.user);
}

const registro = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, Number(BCRYPT_SALT_ROUNDS));
    const existingUser = await User.getByEmail(req.body.email);
    if (existingUser) {
        return res.status(403).json({ message: 'Email already exists' });
    }

    req.body.fecha_nacimiento = dayjs(req.body.fechaNacimiento).format('YYYY-MM-DD');

    const result = await User.insertUser(req.body);

    if (!result || !result.insertId) {
        return res.status(400).json({ message: 'Failed to register user' });
    }

    const { peso, altura } = req.body;

    const metricsResult = await User.insertUserMetrics(
            result.insertId,
            peso,
            altura,
            peso && altura ? Number(peso) / ((Number(altura) / 100) ** 2) : null
    );

    if (!metricsResult || !metricsResult.insertId) {
        return res.status(400).json({ message: 'Failed to register user metrics' });
    }

    // OPTIMIZE: send verification link via email when a new user registers

    const newUser = await User.getById(result.insertId);

    if (!newUser) {
        return res.status(400).json({ message: 'Failed to retrieve new user' });
    }

    newUser.fecha_nacimiento = dayjs(newUser.fechaNacimiento).format('YYYY-MM-DD');
    newUser.fecha_alta = dayjs(newUser.fechaAlta).format('YYYY-MM-DD');
    res.json(newUser);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.getByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Error in email and/or password' });
    }

    try {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Error in email and/or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error validating password', error: error.message });
        
    }
    return res.json({ 
        message: 'Login successful',
        token: jwt.sign({
            user_id: user.id,
            exp: dayjs().add(JWT_EXPIRES_IN_AMOUNT, JWT_EXPIRES_IN_UNIT).unix()
        }, JWT_SECRET_KEY)
    });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }


    const user = await User.getByEmail(email);
    if (!user) {
        return res.status(403).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({
            user_id: user.id,
            exp: dayjs().add(JWT_RESET_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_UNIT).unix()
        }, JWT_RESET_SECRET_KEY)
    
    verificationLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    

    // OPTIMIZE: send verification link via email when a new user registers
    try {
        sendResetPasswordEmail(user.email, verificationLink, user.nombre);

    } catch (error) {
        return res.status(500).json({ message: 'Failed to send verification email' });
    }


    try {
        await User.updateResetToken(user.id, resetToken);
    } catch (error) {
        return res.status(400).json({ message: 'Failed to update reset token' });
    }

    return res.json({
        message: 'Password reset link sent to your email',
        verificationLink
    });

}

const resetPassword = async (req, res) => {
    console.log('Resetting password');
    const { newPassword } = req.body;
    const resetToken = req.headers['reset-token']

    if (!resetToken || !newPassword) {
        return res.status(403).json({ message: 'Reset token and new password are required' });
    }

    let payload
    try {
        payload = jwt.verify(resetToken, JWT_RESET_SECRET_KEY);
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }

    const user = await User.getByResetToken(resetToken);
    if(!user) {
        return res.status(403).json({ message: 'User not found' });
    }
    
    try {
        await User.updatePassword(user.id, bcrypt.hashSync(newPassword, Number(BCRYPT_SALT_ROUNDS)));
    } catch (error) {
        return res.status(400).json({ message: 'Failed to reset password' });
    }    

    return res.json({ message: 'Password reset successfully' });
}

module.exports = { getById, registro, login, forgotPassword, resetPassword };