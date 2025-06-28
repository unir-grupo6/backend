const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { transporter, sendResetPasswordEmail } = require('../config/mailer');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_RESET_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_RESET_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS, FRONTEND_URL } = process.env;

const User = require('../models/users.model');

const getRutinesByUserId = async (req, res) => {
    const user = req.user;
    const { page = 1, limit = 5, active = false } = req.query;
    
    const userRutines = active === 'true' ?
        await User.selectActiveRutinesByUserId(user.id, Number(page), Number(limit))
        :
        await User.selectRutinesByUserId(user.id, Number(page), Number(limit));

    if (!userRutines || userRutines.length === 0) {
        return res.status(404).json({ message: 'No rutines found for this user' });
    }

    for (const rutine of userRutines) {
        // DATES
        const fechaInicio = dayjs(rutine.fecha_inicio_rutina);
        const fechaFin = dayjs(rutine.fecha_fin_rutina);
        const today = dayjs();

        rutine.rutina_activa = today >= fechaInicio && today <= fechaFin;
        rutine.fecha_inicio_rutina = fechaInicio.format('DD-MM-YYYY');
        rutine.fecha_fin_rutina = fechaFin.format('DD-MM-YYYY');
        rutine.rutina_compartida = rutine.rutina_compartida === 1;

        const exercises = await User.selectExercisesByUserRutineId(rutine.rutina_id);
        rutine.ejercicios = exercises;
    }

    user.fecha_alta = dayjs(user.fecha_alta).format('DD-MM-YYYY HH:mm:ss');

    user.rutinas = userRutines;
    res.json(user);
}

const getRutineById = async (req, res) => {
    const user = req.user;
    const { rutineId } = req.params;
    const userRutine = await User.selectRutineByUserIdRutineId(user.id, rutineId);
    if (!userRutine) {
        return res.status(404).json({ message: 'Rutine not found for this user' });
    }
    // DATES
    const fechaInicio = dayjs(userRutine.fecha_inicio_rutina);
    const fechaFin = dayjs(userRutine.fecha_fin_rutina);
    const today = dayjs();
    userRutine.rutina_activa = today >= fechaInicio && today <= fechaFin;
    userRutine.fecha_inicio_rutina = fechaInicio.format('DD-MM-YYYY');
    userRutine.fecha_fin_rutina = fechaFin.format('DD-MM-YYYY');
    // BOOLEANS
    userRutine.rutina_compartida = userRutine.rutina_compartida === 1;

    const exercises = await User.selectExercisesByUserRutineId(userRutine.rutine_id);
    userRutine.ejercicios = exercises;
    
    res.json(userRutine);
}

const registro = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, Number(BCRYPT_SALT_ROUNDS));
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

const changePassword = async (req, res) => {
    const user = req.user;
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, Number(BCRYPT_SALT_ROUNDS));
        await User.updatePassword(user.id, hashedPassword);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating password' });
    }
    return res.json({ message: 'Password updated successfully' });
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
    const { password } = req.body;
    const resetToken = req.headers['reset-token']

    if (!resetToken || !password) {
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
        await User.updatePassword(user.id, bcrypt.hashSync(password, Number(BCRYPT_SALT_ROUNDS)));
    } catch (error) {
        return res.status(400).json({ message: 'Failed to reset password' });
    }    

    return res.json({ message: 'Password reset successfully' });
}

module.exports = {
    getRutinesByUserId,
    getRutineById,
    registro,
    login,
    changePassword,
    forgotPassword,
    resetPassword 
};