const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { transporter, sendResetPasswordEmail } = require('../config/mailer');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_RESET_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_RESET_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS, FRONTEND_URL } = process.env;

const User = require('../models/users.model');

const getUserRoutinesByUserId = async (req, res) => {
    const user = req.user;
    const { page = 1, limit = 3, active = false } = req.query;
    
    const userRoutines = active === 'true' ?
        await User.selectActiveRoutinesByUserId(user.id, Number(page), Number(limit))
        :
        await User.selectRoutinesByUserId(user.id, Number(page), Number(limit));

    if (!userRoutines || userRoutines.length === 0) {
        return res.status(404).json({ message: 'No routines found for this user' });
    }

    for (const routine of userRoutines) {
        // DATES
        const fechaInicio = dayjs(routine.fecha_inicio_rutina);
        const fechaFin = dayjs(routine.fecha_fin_rutina);
        const today = dayjs();
        routine.rutina_activa = today >= fechaInicio && today <= fechaFin;
        
        routine.fecha_inicio_rutina = fechaInicio.format('DD-MM-YYYY');
        routine.fecha_fin_rutina = fechaFin.format('DD-MM-YYYY');

        // BOOLEANS
        routine.rutina_compartida = routine.rutina_compartida === 1;
    }

    user.fecha_alta = dayjs(user.fecha_alta).format('DD-MM-YYYY HH:mm:ss');

    user.rutinas = userRoutines;
    res.json(user);
}

const registro = async (req, res) => {
    req.body.contraseña = bcrypt.hashSync(req.body.contraseña, Number(BCRYPT_SALT_ROUNDS));
    const existingUser = await User.getByEmail(req.body.email);
    if (existingUser) {
        return res.status(403).json({ message: 'Email already exists' });
    }
    const result = await User.insert(req.body);

    // OPTIMIZE: send verification link via email when a new user registers

    const newUser = await User.getById(result.insertId);
    res.json(newUser);
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.getByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Error in email and/or password' });
    }

    try {
        const isValidPassword = bcrypt.compareSync(password, user.contraseña);
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
        sendResetPasswordEmail(user.email, verificationLink);

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

    //TODO: Validate new password (e.g., length, complexity)

    try {
        await User.updatePassword(user.id, bcrypt.hashSync(newPassword, Number(BCRYPT_SALT_ROUNDS)));
    } catch (error) {
        return res.status(400).json({ message: 'Failed to reset password' });
    }    

    return res.json({ message: 'Password reset successfully' });
}

module.exports = {
    getUserRoutinesByUserId,
    registro,
    login,
    forgotPassword,
    resetPassword 
};