
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const User = require('../models/user-routines.model');
const pdfBuilder = require('../doc-generator/pdf-kit');

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
    
    // Get the total number of routines and total pages
    const totalRoutines = await User.countRoutinesByUserId(user.id);
    const totalPages = Math.ceil(totalRoutines / limit);
    user.total_routines = totalRoutines;
    user.current_page = Number(page);
    user.total_pages = totalPages;

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

// Endpoint para obtener todos los ejercicios de todas las rutinas de usuario autenticado
const getAllUserExercises = async (req, res) => {
    const user = req.user;
    try {
        // Método que debe estar implementado en el modelo user-routines.model.js
        const allExercises = await User.selectAllExercisesByUserId(user.id);
        if (!allExercises || allExercises.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ejercicios para las rutinas del usuario.' });
        }
        // Agrupar ejercicios por rutina_usuario_id y devolver como array de objetos
        const rutinasMap = {};
        // biome-ignore lint/complexity/noForEach: <explanation>
        allExercises.forEach(ej => {
            if (!rutinasMap[ej.rutina_usuario_id]) {
                rutinasMap[ej.rutina_usuario_id] = {
                    rutina_usuario_id: ej.rutina_usuario_id,
                    rutina_nombre: ej.rutina_nombre,
                    ejercicios: []
                };
            }
            // Eliminar campos duplicados en el array de ejercicios
            const { rutina_usuario_id, rutina_nombre, ...ejercicio } = ej;
            rutinasMap[ej.rutina_usuario_id].ejercicios.push(ejercicio);
        });
        const rutinasArray = Object.values(rutinasMap);
        return res.json(rutinasArray);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los ejercicios de las rutinas del usuario', error });
    }
};

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

const updateUserRoutine = async (req, res) => {
    const user = req.user;
    const { userRoutineId } = req.params;
    const { fecha_inicio_rutina, fecha_fin_rutina, rutina_compartida, dia } = req.body;
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
    if (dia && (typeof dia !== 'number' || dia < 1 || dia > 7)) {
        return res.status(400).json({ message: 'Invalid value for dia, must be a number between 1 and 7' });
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
    if (dia) {
        updateFields.dia = dia;
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
    const { ejercicio_id } = req.body;
    if (!ejercicio_id) {
        return res.status(400).json({ message: 'ejercicio_id is required' });
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
        await User.insertUserRoutineExercise(ejercicio_id, userRoutine.id, lastOrder + 1);
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

const generatePdfFromUserRoutine = async (req, res) => {
    const user = req.user;

    const { userRoutineId } = req.params;
    const userRoutine = await User.selectRoutineByUserIdRoutineId(user.id, userRoutineId);
    if (!userRoutine) {
        return res.status(404).json({ message: 'Routine not found for the the specified user' });
    }

    const formattedRoutine = await formatRoutineWithExercises(userRoutine);
    if (!formattedRoutine) {
        return res.status(500).json({ message: 'Error formatting routine with exercises' });
    }

    const fileName = `routine-${userRoutineId}-${userRoutine.nombre.replace(/\s+/g, '-')}.pdf`;
    const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${fileName}`
    });

    try {
        pdfBuilder.buildPdfFromUserRoutine(
            (data) => stream.write(data),
            () => res.end(),
            formattedRoutine
        );
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF' });
    }

}

const copyExecrisesToRoutine = async (res, userRoutineId, generatedUserRoutineId) => {
    const exercises = await User.selectExercisesByUserRoutineId(userRoutineId);
    // if (!exercises || exercises.length === 0) {
    //     res.status(404).json({ message: 'No exercises found for the specified routine.' });
    // }
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

module.exports = {
    getRoutinesByUserId,
    getRoutineById,
    updateUserRoutine,
    updateUserRoutineExercise,
    saveUserRoutine,
    addExerciseToRoutine,
    removeUserRoutine,
    removeExerciseFromRoutine,
    generatePdfFromUserRoutine,
    copyExecrisesToRoutine,
    formatRoutineWithExercises
    ,getAllUserExercises
};

