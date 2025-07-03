const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { sendResetPasswordEmail } = require('../config/mailer');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_RESET_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_RESET_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS, FRONTEND_URL } = process.env;

const User = require('../models/users.model');

const getById = async (req, res) => {
    req.user.fecha_nacimiento = dayjs(req.user.fecha_nacimiento).format('DD-MM-YYYY');
    req.user.fecha_alta = dayjs(req.user.fecha_alta).format('DD-MM-YYYY HH:mm:ss');
    res.json(req.user);
}

const registro = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, Number(BCRYPT_SALT_ROUNDS));
    const existingUser = await User.getByEmail(req.body.email);

    // Check than all fields are present
    if (!req.body.nombre || !req.body.apellidos || !req.body.email || !req.body.password || !req.body.fecha_nacimiento || !req.body.peso || !req.body.altura || !req.body.objetivo_id) {
        return res.status(400).json({ message: 'Nombre, apellidos, email, password, fecha_nacimiento, peso, altura and objetivo_id are required' });
    }

    if (typeof req.body.nombre !== 'string' || typeof req.body.apellidos !== 'string' || typeof req.body.email !== 'string') {
        return res.status(400).json({ message: 'Nombre, apellidos, and email must be strings' });
    }

    if (req.body.peso && isNaN(req.body.peso)) {
        return res.status(400).json({ message: 'Peso must be a number' });
    }
    if (req.body.altura && isNaN(req.body.altura)) {
        return res.status(400).json({ message: 'Altura must be a number' });
    }
    if (!dayjs(req.body.fecha_nacimiento, 'DD-MM-YYYY', true).isValid()) {
        return res.status(400).json({ message: 'Fecha de nacimiento must be a valid date' });
    }
    if (req.body.objetivo_id && isNaN(req.body.objetivo_id)) {
        return res.status(400).json({ message: 'Objetivo ID must be a number' });
    }

    if (existingUser) {
        return res.status(403).json({ message: 'Email already exists' });
    }

    // check if obtetyivo_id is valid
    const objetivoExists = await User.getObjectiveById(id_objetivo);
    if (!objetivoExists) {
        return res.status(400).json({ message: 'Invalid objetivo_id' });
    }

    req.body.fecha_nacimiento = dayjs(req.body.fecha_nacimiento).format('YYYY-MM-DD');

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

    // Insert objectives
    if (req.body.objetivo_id) {
        const objectiveResult = await User.insertUserObjective(result.insertId, req.body.objetivo_id);
        if (!objectiveResult || !objectiveResult.insertId) {
            return res.status(400).json({ message: 'Failed to register user objective' });
        }
    }

    // OPTIMIZE: send verification link via email when a new user registers

    const newUser = await User.getById(result.insertId);

    if (!newUser) {
        return res.status(400).json({ message: 'Failed to retrieve new user' });
    }

    newUser.fecha_nacimiento = dayjs(newUser.fecha_nacimiento).format('YYYY-MM-DD');
    newUser.fecha_alta = dayjs(newUser.fecha_alta).format('YYYY-MM-DD');

    const token = jwt.sign(
        { user_id: newUser.id },
        JWT_SECRET_KEY,
        { expiresIn: `${JWT_EXPIRES_IN_AMOUNT} ${JWT_EXPIRES_IN_UNIT}` }
    );

    res.json({
        message: 'User registered successfully',
        token: token,
        user: newUser,
    });
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
    const { oldPassword, password } = req.body;
    
    if (!oldPassword || !password) {
        return res.status(400).json({ message: 'Old password and new password are required' });
    }

    if (typeof password !== 'string' || typeof oldPassword !== 'string') {
        return res.status(400).json({ message: 'Old password and new password must be strings' });
    }

    //check if the old password is correct
    try {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Error in email and/or password' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error validating password', error: error.message });
        
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
    
    verificationLink = `${FRONTEND_URL}password-reset-request/${resetToken}`;

    

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

    try {
        await User.updatePassword(user.id, bcrypt.hashSync(password, Number(BCRYPT_SALT_ROUNDS)));
    } catch (error) {
        return res.status(400).json({ message: 'Failed to reset password' });
    }    

    return res.json({ message: 'Password reset successfully' });
}

const updateUser = async (req, res) => {
    const user = req.user;
    const { nombre, apellidos, email, peso, altura, fecha_nacimiento, id_objetivo } = req.body;

    if (!nombre || !apellidos || !email || !fecha_nacimiento || !id_objetivo) {
        return res.status(400).json({ message: 'Nombre, apellidos, email, fecha_nacimiento and id_objetivo are required' });
    }

    if (typeof nombre !== 'string' || typeof apellidos !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ message: 'Nombre, apellidos, and email must be strings' });
    }

    if (peso && isNaN(peso)) {
        return res.status(400).json({ message: 'Peso must be a number' });
    }
    if (altura && isNaN(altura)) {
        return res.status(400).json({ message: 'Altura must be a number' });
    }
    if (fecha_nacimiento && !dayjs(fecha_nacimiento, 'DD-MM-YYYY', true).isValid()) {
        return res.status(400).json({ message: 'Fecha de nacimiento must be a valid date' });
    }
    if (id_objetivo && isNaN(id_objetivo)) {
        return res.status(400).json({ message: 'Objetivo ID must be a number' });
    }

    //check if email already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser && existingUser.id !== user.id) {
        return res.status(403).json({ message: 'Email already exists' });
    }

    // check if obtetyivo_id is valid
    const objetivoExists = await User.getObjectiveById(id_objetivo);
    if (!objetivoExists) {
        return res.status(400).json({ message: 'Invalid objetivo_id' });
    }

    const newFechaNacimiento = dayjs(fecha_nacimiento, 'DD-MM-YYYY', true).format('YYYY-MM-DD');

    try {
        const result = await User.updateUserData(user.id, { nombre, apellidos, email, fecha_nacimiento: newFechaNacimiento });

        if (!result.affectedRows) {
            return res.status(400).json({ message: 'Failed to update user data' });
        }

        const currentMetrics = await User.getUserMetrics(user.id);
        let newAltura = null;
        let newPeso = null;
        let newImc = null;

        if (peso && altura) {
            newAltura = altura;
            newPeso = peso;
        } else if (peso && !altura) {
            newAltura = currentMetrics.altura;
            newPeso = peso;
        } else if (!peso && altura) {
            newPeso = currentMetrics.peso;
            newAltura = altura;
        } else if (!peso && !altura) {
            newPeso = currentMetrics.peso;
            newAltura = currentMetrics.altura;
        }

        newImc = Number(newPeso) / ((Number(newAltura) / 100) ** 2);

        if (
            (dayjs(currentMetrics.fecha).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) &&
            (currentMetrics.peso !== peso || currentMetrics.altura !== altura || currentMetrics.imc !== newImc)
        ) {
            const metricsResult = await User.updateUserMetrics(user.id, newPeso, newAltura, newImc);

            if (!metricsResult.affectedRows) {
                return res.status(400).json({ message: 'Failed to update user metrics' });
            }
        }else if (
            (dayjs(currentMetrics.fecha).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD')) &&
            (currentMetrics.peso !== peso || currentMetrics.altura !== altura || currentMetrics.imc !== newImc)
        ) {
            const metricsResult = await User.insertUserMetrics(user.id, newPeso, newAltura, newImc);

            if (!metricsResult.affectedRows) {
                return res.status(400).json({ message: 'Failed to insert new user metrics' });
            }
        }

        if (id_objetivo !== user.objetivo_id) {
            const objectiveResult = await User.insertUserObjective(user.id, id_objetivo);
            if (!objectiveResult.affectedRows) {
                return res.status(400).json({ message: 'Failed to update user objective' });
            }
        }

        const updatedUser = await User.getById(user.id);
        updatedUser.fecha_nacimiento = dayjs(updatedUser.fecha_nacimiento).format('DD-MM-YYYY');
        updatedUser.fecha_alta = dayjs(updatedUser.fecha_alta).format('DD-MM-YYYY HH:mm:ss');

        return res.json(updatedUser);

    } catch (error) {
        return res.status(500).json({ message: 'Error updating user' });
    }
};

module.exports = {
    getById,
    registro,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    updateUser
};