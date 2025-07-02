const auto = require('../models/user-autogenerate-routine.model');

let usuarioObjetivos = {
    idusuario: 0,
    objetivo: 0,
    rutinas_realizadas: []    
}


const autoGenerate = async (req, res) => {

    let usuarioObjetivos = {
        idusuario: 0,
        objetivo: 0,
        rutinas_realizadas: []    
    };

    let rutinasIds;
    let result;

    try{
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid idUser' });
        }

        result = await auto.objetivosUsuario(id);

        usuarioObjetivos.idusuario = id;
        usuarioObjetivos.objetivo = result[0].id_objetivos;        
        
        result = await auto.rutinasRealizadas(id);

        // Añadir el array result a rutinas_realizadas
        rutinasIds = result.map(obj => obj.rutinas_id);
        usuarioObjetivos.rutinas_realizadas = rutinasIds;
        
        result = await auto.rutinasAutogeneradas(id);
        
        
        // Extraer los IDs de las rutinas autogeneradas y filtrar duplicados
        const rutinasAutogeneradasIds = result.map(obj => obj.idrutina);
        const nuevosIds = rutinasAutogeneradasIds.filter(id => !rutinasIds.includes(id));
        rutinasIds.push(...nuevosIds);
        
        // Actualizar el objeto con todos los IDs combinados
        usuarioObjetivos.rutinas_realizadas = rutinasIds;        

        result = await auto.rutinaSugerida(usuarioObjetivos);
        console.log(result, ' - RUTINA SUGERIDA EN CONTROLADOR');

        if (!result) {
            return res.status(499).json({ message: 'No se han sugerido rutinas' });
        }
        
        return res.status(200).json(result);
    
    }
    catch (error) {
        console.error('Error in autoGenerate controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
   
}

module.exports = {
    autoGenerate
}