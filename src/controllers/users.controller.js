const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { transporter, sendResetPasswordEmail } = require('../config/mailer');

require('dotenv').config();
const { JWT_SECRET_KEY, JWT_RESET_SECRET_KEY, JWT_EXPIRES_IN_UNIT, JWT_RESET_EXPIRES_IN_UNIT, JWT_EXPIRES_IN_AMOUNT, JWT_RESET_EXPIRES_IN_AMOUNT, BCRYPT_SALT_ROUNDS, FRONTEND_URL } = process.env;

const User = require('../models/users.model');

const getById = async (req, res) => {
    req.user.fecha_nacimiento = dayjs(req.user.fecha_nacimiento).format('DD-MM-YYYY');
    req.user.fecha_alta = dayjs(req.user.fecha_alta).format('DD-MM-YYYY HH:mm:ss');
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

    user.fecha_nacimiento = dayjs(user.fecha_nacimiento).format('DD-MM-YYYY');
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

const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { nombre, apellidos, email, peso, altura, fecha_nacimiento } = req.body;

    if (!nombre || !apellidos || !email || !fecha_nacimiento) {
        return res.status(400).json({ message: 'Nombre, apellidos, email, and fecha_nacimiento are required' });
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

    const newFechaNacimiento = dayjs(fecha_nacimiento, 'DD-MM-YYYY', true).format('YYYY-MM-DD');

    try {
        const result = await User.updateUserData(userId, { nombre, apellidos, email, fecha_nacimiento: newFechaNacimiento });

        if (!result.affectedRows) {
            return res.status(400).json({ message: 'Failed to update user data' });
        }

        const currentMetrics = await User.getUserMetrics(userId);
        let newAltura = null;
        let newPeso = null;
        let newImc = null;

        if (peso && !altura) {
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
            const metricsResult = await User.updateUserMetrics(userId, newPeso, newAltura, newImc);

            if (!metricsResult.affectedRows) {
                return res.status(400).json({ message: 'Failed to update user metrics' });
            }
        }else if (
            (dayjs(currentMetrics.fecha).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD')) &&
            (currentMetrics.peso !== peso || currentMetrics.altura !== altura || currentMetrics.imc !== newImc)
        ) {
            const metricsResult = await User.insertUserMetrics(userId, newPeso, newAaltura, newImc);

            if (!metricsResult.affectedRows) {
                return res.status(400).json({ message: 'Failed to insert new user metrics' });
            }
        }

        const updatedUser = await User.getById(userId);
        return res.json(updatedUser);

    } catch (error) {
        return res.status(500).json({ message: 'Error updating user' });
    }
};

const updateUserRoutine = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const { fecha_inicio_rutina, fecha_fin_rutina, rutina_compartida } = req.body;
    if ((fecha_inicio_rutina && !fecha_fin_rutina) || (!fecha_inicio_rutina && fecha_fin_rutina)) {
        return res.status(400).json({ message: 'Both start and end dates are required in case one is provided' });
    }

    // Validations
    if (
        (fecha_inicio_rutina && !dayjs(fecha_inicio_rutina, 'DD-MM-YYYY', true).isValid()) ||
        (fecha_fin_rutina && !dayjs(fecha_fin_rutina, 'DD-MM-YYYY', true).isValid())
    ) {
        return res.status(400).json({ message: 'Invalid date format or non-existent date' });
    }
    if (
        (fecha_inicio_rutina && fecha_fin_rutina) && 
        dayjs(fecha_inicio_rutina, 'DD-MM-YYYY', true).isAfter(dayjs(fecha_fin_rutina, 'DD-MM-YYYY', true))) {
        return res.status(400).json({ message: 'Start date cannot be after end date' });
    }
    if( rutina_compartida !== undefined && typeof rutina_compartida !== 'boolean') {
        return res.status(400).json({ message: 'Invalid value for rutina_compartida, must be a boolean' });
    }

    // Check if the user routine exists
    const userRoutine = await User.selectUserRoutineByIdUserId(user.id, userRoutineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'No routines found for the specified user.' });
    }

    // Add fields to update
    const updateFields = {};
    if (fecha_inicio_rutina  && fecha_fin_rutina) {
        updateFields.inicio = dayjs(fecha_inicio_rutina, 'DD-MM-YYYY', true).format('YYYY-MM-DD');
        updateFields.fin = dayjs(fecha_fin_rutina, 'DD-MM-YYYY', true).format('YYYY-MM-DD');
    }
    if (rutina_compartida === true || rutina_compartida === false) {
        updateFields.compartida = rutina_compartida ? 1 : 0;
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    // Update the user routine
    let updateResult;
    try {
        updateResult = await User.updateRoutineById(userRoutineId, updateFields);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user routine' });
    }

    if (!updateResult || updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'No routines found for the specified user.' });
    }

    console.log(updateFields);

    // Retrieve the updated routine
    const updatedRoutine = await User.selectRoutineByUserIdRoutineId(user.id, userRoutineId);
    if (!updatedRoutine) {
        return res.status(404).json({ message: 'Updated routine not found' });
    }

    const formattedRoutine = await formatRoutineWithExercises(updatedRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }
    res.json(formattedRoutine);

}

const updateUserRoutineExercise = async (req, res) => {
    const user = req.user;
    const { userRoutineId, exerciseId } = req.params;
    const { series, repeticiones, orden, comentario } = req.body;
    if (!series && !repeticiones && !orden) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Validations
    if (series && (typeof series !== 'number' || series <= 0)) {
        return res.status(400).json({ message: 'Invalid value for series, must be a positive number' });
    }
    if (repeticiones && (typeof repeticiones !== 'number' || repeticiones <= 0)) {
        return res.status(400).json({ message: 'Invalid value for repeticiones, must be a positive number' });
    }
    if (orden && (typeof orden !== 'number' || orden <= 0)) {
        return res.status(400).json({ message: 'Invalid value for orden, must be a positive number' });
    }
    if (comentario && typeof comentario !== 'string') {
        return res.status(400).json({ message: 'Invalid value for comentario, must be a string' });
    }

    // Check if the user routine exists
    const userRoutine = await User.selectUserRoutineByIdUserId(user.id, userRoutineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'No routines found for the specified user.' });
    }

    // Check if the exercise exists
    const exercise = await User.selectUserExerciseById(exerciseId, userRoutineId);
    if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found in the specified routine' });
    }

    // Add fields to update
    const updateFields = {};
    if (series) updateFields.series = series;
    if (repeticiones) updateFields.repeticiones = repeticiones;
    if (orden) updateFields.orden = orden;
    if (comentario) updateFields.comentario = comentario;

    // // Check if orden is not repeated
    // if (orden) {
    //     const exercisesInRoutine = await User.selectExercisesByUserRoutineId(userRoutineId);
    //     if (exercisesInRoutine && exercisesInRoutine.length > 0) {
    //         const existingOrder = exercisesInRoutine.find(ex => ex.orden === orden && ex.id !== exerciseId);
    //         if (existingOrder) {
    //             return res.status(400).json({ message: 'The order number is already assigned to another exercise in the routine.' });
    //         }
    //     }
    // }

    const exercisesInRoutine = await User.selectExercisesByUserRoutineId(userRoutineId);

    // Check if orden is not less than 1 and not greater than the number of exercises in the routine
    if (orden) {
        if (exercisesInRoutine && exercisesInRoutine.length > 0) {
            const maxOrder = exercisesInRoutine.length;
            if (orden < 1 || orden > maxOrder) {
                return res.status(400).json({ message: `The order number must be between 1 and ${maxOrder}.` });
            }
        }
    }

    // Update the user routine exercise
    let updateResult;
    try {
        updateResult = await User.updateUserRoutineExerciseById(exerciseId, userRoutineId, updateFields);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user routine exercise' });
    }

    if (!updateResult || updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'No exercises found for the specified routine.' });
    }

    // Check if the orden has changed and update the order of other exercises if necessary
    if (orden) {
        const exercisesInRoutine = await User.selectExercisesByUserRoutineId(userRoutineId);
        if (exercisesInRoutine && exercisesInRoutine.length > 0) {
            // Move the updated exercise to the desired position and reorder the rest
            // Find the index of the exercise being updated
            const updatedExerciseIndex = exercisesInRoutine.findIndex(ex => ex.id === Number(exerciseId));
            if (updatedExerciseIndex === -1) {
                return res.status(404).json({ message: 'Exercise not found in the routine' });
            }

            // Remove the exercise from its current position
            const [updatedExercise] = exercisesInRoutine.splice(updatedExerciseIndex, 1);

            // Insert the exercise at the new position (orden - 1, since array is 0-based)
            exercisesInRoutine.splice(orden - 1, 0, updatedExercise);

            // Update the orden for all exercises
            for (let j = 0; j < exercisesInRoutine.length; j++) {
                const exerciseToUpdate = exercisesInRoutine[j];
                if (exerciseToUpdate.orden !== j + 1) {
                    try {
                        await User.updateExerciseOrder(exerciseToUpdate.id, userRoutineId, j + 1);
                    } catch (error) {
                        return res.status(500).json({ message: 'Error updating exercise order in user routine' });
                    }
                }
            }
        }
    }
    
    // Retrieve the updated routine with exercises
    const updatedRoutine = await User.selectRoutineByUserIdRoutineId(user.id, userRoutineId);
    if (!updatedRoutine) {
        return res.status(404).json({ message: 'Updated routine not found' });
    }
    const formattedRoutine = await formatRoutineWithExercises(updatedRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }
    res.json(formattedRoutine);
}

const saveUserRoutine = async (req, res) => {
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
    const insertedExercises = await copyExecrisesToRoutine(res, userRoutineId, generatedUserRoutine.insertId);
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

const addExerciseToRoutine = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const { ejercicio_id, series, repeticiones, orden, comentario } = req.body;
    if (!ejercicio_id || !series || !repeticiones || !orden) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if the user routine exists
    const userRoutine = await User.selectUserRoutineByIdUserId(user.id, userRoutineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'No routines found for the specified user.' });
    }
    // Check if the exercise exists
    const exercise = await User.selectExerciseById(ejercicio_id);
    if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
    }

    // Get the last order of the exercises in the routine
    let lastOrder = 0;
    const exercisesInRoutine = await User.selectExercisesByUserRoutineId(userRoutine.id);
    if (exercisesInRoutine && exercisesInRoutine.length > 0) {
        lastOrder = Math.max(...exercisesInRoutine.map(ex => ex.orden));
    }

    // Insert the exercise into the user routine
    try {
        await User.insertUserRoutineExercise(ejercicio_id, userRoutine.id, series, repeticiones, lastOrder + 1, comentario);
    } catch (error) {
        return res.status(500).json({ message: 'Error saving exercise for the routine' });
    }

    // Retrieve the updated routine with exercises
    const updatedRoutine = await User.selectRoutineByUserIdRoutineId(user.id, userRoutineId);
    if (!updatedRoutine) {
        return res.status(404).json({ message: 'Updated routine not found' });
    }
    const formattedRoutine = await formatRoutineWithExercises(updatedRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }
    res.json(formattedRoutine);
}

const removeUserRoutine  = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const routineId = await User.selectUserRoutineByIdUserId( user.id, userRoutineId);
    if (!routineId) {
        return res.status(404).json({ message: 'The specified routine was not found for the user.' });
    }

    try {
        await User.deleteUserRoutine(userRoutineId);
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user routine' });
    }
    return res.json({ message: 'Routine deleted successfully' });
}

const removeExerciseFromRoutine = async (req, res) => {
    const user = req.user;
    const { userRoutineId, exerciseId } = req.params;
    const userRoutine = await User.selectUserRoutineByIdUserId(user.id, userRoutineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'The specified routine was not found for the user.' });
    }

    const exercise = await User.selectUserExerciseById(exerciseId, userRoutineId);
    if (!exercise) {
        return res.status(404).json({ message: 'The specified exercise was not found.' });
    }
    try {
        await User.deleteUserRoutineExercise(exerciseId);
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting exercise from user routine' });
    }

    const exercisesInRoutine = await User.selectExercisesByUserRoutineId(userRoutineId);
    if (exercisesInRoutine && exercisesInRoutine.length > 0) {
        for (let i = 0; i < exercisesInRoutine.length; i++) {
            const exerciseToUpdate = exercisesInRoutine[i];

            if (exerciseToUpdate.orden === i + 1) {
                continue; // No need to update the order if it is already correct
            }

            try {
                await User.updateExerciseOrder(exerciseToUpdate.id, userRoutineId, i + 1);
            } catch (error) {
                return res.status(500).json({ message: 'Error updating exercise order in user routine' });
            }
        }
    }

    // Retrieve the updated routine with exercises
    const updatedRoutine = await User.selectRoutineByUserIdRoutineId(user.id, userRoutineId);
    if (!updatedRoutine) {
        return res.status(404).json({ message: 'Updated routine not found' });
    }
    const formattedRoutine = await formatRoutineWithExercises(updatedRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }
    res.json(formattedRoutine);
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
    updateUser,
    updateUserRoutine,
    updateUserRoutineExercise,
    saveUserRoutine,
    addExerciseToRoutine,
    removeUserRoutine,
    removeExerciseFromRoutine
};

const copyExecrisesToRoutine = async (res, userRoutineId, generatedUserRoutineId) => {
    const exercises = await User.selectExercisesByUserRoutineId(userRoutineId);
    if (!exercises || exercises.length === 0) {
        res.status(404).json({ message: 'No exercises found for the specified routine.' });
    }
    for (const exercise of exercises) {
        const {ejercicios_id, series, repeticiones, dia, orden, comentario } = exercise;
        try {
            await User.insertUserRoutineExercise(ejercicios_id, generatedUserRoutineId, series, repeticiones, orden, comentario);
        } catch (error) {
            res.status(500).json({ message: 'Error saving exercise for the routine' });
        }
    }
    return true;
}

const formatRoutineWithExercises = async (userRoutine) => {

    const fechaInicio = userRoutine.fecha_inicio_rutina ? dayjs(userRoutine.fecha_inicio_rutina).format('DD-MM-YYYY') : null;
    const fechaFin = userRoutine.fecha_fin_rutina ? dayjs(userRoutine.fecha_fin_rutina).format('DD-MM-YYYY') : null;

    const rutina_activa = fechaInicio && fechaFin
        ? dayjs().isAfter(dayjs(fechaInicio, 'DD-MM-YYYY').subtract(1, 'day')) &&
          dayjs().isBefore(dayjs(fechaFin, 'DD-MM-YYYY').add(1, 'day'))
        : false;

    const formattedRoutine = {
        rutina_id: userRoutine.rutina_id,
        nombre: userRoutine.nombre|| '',
        fecha_inicio_rutina: fechaInicio,
        fecha_fin_rutina: fechaFin,
        rutina_activa: rutina_activa,
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
                    ejercicio_id: exercise.id,
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