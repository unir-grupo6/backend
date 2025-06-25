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

const getRoutinesByUserId = async (req, res) => {
    const user = req.user;
    const { page = 1, limit = 5, active = false } = req.query;
    
    const userRoutines = active === 'true' ?
        await User.selectActiveRoutinesByUserId(user.id, Number(page), Number(limit))
        :
        await User.selectRoutinesByUserId(user.id, Number(page), Number(limit));

    if (!userRoutines || userRoutines.length === 0) {
        return res.status(404).json({ message: 'No routines found for this user' });
    }

    const formattedRoutines = [];
    for (const routine of userRoutines) {
        try {
            const formattedRoutine = await formatRoutineWithExercises(routine);
            if (formattedRoutine) {
                formattedRoutines.push(formattedRoutine);
            }else {
                return res.status(500).json({ message: 'Error formatting routine with exercises' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error formatting routine with exercises' });
        }
    }
    user.rutinas = formattedRoutines;

    user.fecha_alta = dayjs(user.fecha_alta).format('DD-MM-YYYY HH:mm:ss');

    res.json(user);
}

const getRoutineById = async (req, res) => {
    const user = req.user;
    const { routineId } = req.params;
    const userRoutine = await User.selectRoutineByUserIdRoutineId(user.id, routineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'Routine not found for this user' });
    }

    const formattedRoutine = await formatRoutineWithExercises(userRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }
    res.json(formattedRoutine);
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

    try {
        await User.updatePassword(user.id, bcrypt.hashSync(password, Number(BCRYPT_SALT_ROUNDS)));
    } catch (error) {
        return res.status(400).json({ message: 'Failed to reset password' });
    }    

    return res.json({ message: 'Password reset successfully' });
}

const  saveUserRoutine = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const selectedRoutine = await User.selectUserRoutineById(userRoutineId);
    if (!selectedRoutine) {
        return res.status(404).json({ message: 'No routines found for the specified ID.' });
    }

    // Insert the user routine
    let generatedUserRoutine;
    try {
        generatedUserRoutine = await User.insertUserRoutine(selectedRoutine.rutinas_id, user.id);
    } catch (error) {
        return res.status(500).json({ message: 'Error saving user routine' });
    }
    if (!generatedUserRoutine || !generatedUserRoutine.insertId) {
        return res.status(500).json({ message: 'Error generating user routine' });
    }

    // Insert the exercises for the user routine
    const insertedExercises = await copyExecrisesToRoutine(userRoutineId, generatedUserRoutine.insertId);
    if (!insertedExercises) {
        return res.status(500).json({ message: 'Error saving exercises for the routine' });
    }

    // Retrieve the saved routine with exercises
    const savedRoutine = await User.selectRoutineByUserIdRoutineId(user.id, generatedUserRoutine.insertId);
    if (!savedRoutine) {
        return res.status(404).json({ message: 'Saved routine not found' });
    }
    // DATES
    const fechaInicio = dayjs(savedRoutine.fecha_inicio_rutina);
    const fechaFin = dayjs(savedRoutine.fecha_fin_rutina);
    const today = dayjs();
    savedRoutine.rutina_activa = today >= fechaInicio && today <= fechaFin;
    savedRoutine.fecha_inicio_rutina = fechaInicio.format('DD-MM-YYYY');
    savedRoutine.fecha_fin_rutina = fechaFin.format('DD-MM-YYYY');
    // BOOLEANS
    savedRoutine.rutina_compartida = savedRoutine.rutina_compartida === 1;
    savedRoutine.ejercicios = [];
    const exercisesForRoutine = await User.selectExercisesByUserRoutineId(savedRoutine.rutina_id);
    for (const exercise of exercisesForRoutine) {
        savedRoutine.ejercicios.push({
            orden: exercise.orden,
            nombre: exercise.nombre,
            tipo: exercise.tipo,
            step_1: exercise.step_1,
            step_2: exercise.step_2,
            grupos_musculares: exercise.grupos_musculares,
            series: exercise.series,
            repeticiones: exercise.repeticiones,
            comentario: exercise.comentario
        });
    }
    return res.json(savedRoutine);
}

const copyExecrisesToRoutine = async (userRoutineId, generatedUserRoutineId) => {
    const exercises = await User.selectExercisesByUserRoutineId(userRoutineId);
    if (!exercises || exercises.length === 0) {
        return res.status(404).json({ message: 'No exercises found for the specified routine.' });
    }
    for (const exercise of exercises) {
        const {rutinas_id, ejercicios_id, series, repeticiones, dia, orden, comentario } = exercise;
        try {
            await User.insertUserRoutineExercise(rutinas_id, ejercicios_id, generatedUserRoutineId, series, repeticiones, dia, orden, comentario);
        } catch (error) {
            return res.status(500).json({ message: 'Error saving exercise for the routine' });
        }
    }
    return true;
}

const formatRoutineWithExercises = async (userRoutine) => {

    const fechaInicio = userRoutine.fecha_inicio_rutina ? dayjs(userRoutine.fecha_inicio_rutina).format('DD-MM-YYYY') : null;
    const fechaFin = userRoutine.fecha_fin_rutina ? dayjs(userRoutine.fecha_fin_rutina).format('DD-MM-YYYY') : null;

    const formattedRoutine = {
        rutina_id: userRoutine.rutina_id,
        nombre: userRoutine.nombre|| '',
        fecha_inicio_rutina: fechaInicio,
        fecha_fin_rutina: fechaFin,
        rutina_activa: userRoutine.rutina_activa === 1,
        rutina_compartida: userRoutine.rutina_compartida === 1,
        rutina_observaciones: userRoutine.rutina_observaciones || '',
        nivel: userRoutine.nivel || '',
        metodo_nombre: userRoutine.metodo_nombre || '',
        tiempo_aerobicos: userRoutine.tiempo_aerobicos || '',
        tiempo_anaerobicos: userRoutine.tiempo_anaerobicos || '',
        descanso: userRoutine.descanso || '',
        metodo_observaciones: userRoutine.metodo_observaciones || '',
        dia: userRoutine.dia || 0,
        ejercicios: []
    };

    try {
        const exercises = await User.selectExercisesByUserRoutineId(userRoutine.rutina_id);
        if (exercises && exercises.length > 0) {
            for (const exercise of exercises) {
                formattedRoutine.ejercicios.push({
                    orden: exercise.orden,
                    nombre: exercise.nombre || '',
                    tipo: exercise.tipo || '',
                    step_1: exercise.step_1 || '',
                    step_2: exercise.step_2 || '',
                    grupos_musculares: exercise.grupos_musculares || '',
                    series: exercise.series || 0,
                    repeticiones: exercise.repeticiones || 0,
                    comentario: exercise.comentario || ''
                });
            }
        }
    } catch (error) {
        return null;
    }
    
    
    
    return formattedRoutine;
}

const removeUserRoutine  = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const routineId = await User.selectUserRoutineByIdUserId( user.id, userRoutineId);
    if (!routineId) {
        return res.status(404).json({ message: 'No routines found for the user.' });
    }

    try {
        await User.deleteUserRoutine(userRoutineId);
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user routine' });
    }
    return res.json({ message: 'Routine deleted successfully' });
}

module.exports = {
    getById,
    getRoutinesByUserId,
    getRoutineById,
    registro,
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    saveUserRoutine,
    removeUserRoutine
};