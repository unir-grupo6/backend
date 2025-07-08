const auto = require('../models/user-autogenerate-routine.model');


const generarJson = (headerObj,exercisesObj) => {

    const {rutina_id, nombre, rutina_observaciones, realizada, metodo, objetivo, tiempo_aerobicos, 
        tiempo_anaerobicos, metodo_observaciones, descanso, 
        objetivos_id, dificultad_id, metodos_id, dificultad} = headerObj;

    const obj = {
        "rutina_id": rutina_id,
        "nombre": nombre,
        "rutina_observaciones": rutina_observaciones,
        "realizada": realizada,        
        "metodo": metodo,
        "objetivo": objetivo,
        "dificultad": dificultad,
        "tiempo_aerobicos": tiempo_aerobicos,
        "tiempo_anaerobicos": tiempo_anaerobicos,
        "metodo_observaciones": metodo_observaciones,
        "descanso": descanso,
        "objetivos_id": objetivos_id,
        "dificultad_id": dificultad_id,
        "metodos_id": metodos_id,
        "dia": null,
        "ejercicios": exercisesObj
    };
    return obj 
}

const autoGenerate = async (req, res) => {
   
    const {id} = req.user;

    let usuarioObjetivos = {
        idusuario: 0,
        objetivo: 0,
        rutinas_realizadas: []    
    };

    let rutinasIds;
    let result;
    

    try{        
        
        result = await auto.objetivosUsuario(id);
        if (result.length === 0) {     
            return res.status(400).json({ message: 'The user has no defined objectives' });;
        }
        
        usuarioObjetivos.idusuario = id;        
        usuarioObjetivos.objetivo = result[0].id_objetivos;               
        
        result = await auto.rutinasRealizadas(id);
        if (result.length === 0) {     
            result = await auto.retunRutinaRDN(id);
        }        
            rutinasIds = result.map(obj => obj.rutinas_id);
            usuarioObjetivos.rutinas_realizadas = rutinasIds;
       
        result = await auto.rutinasAutogeneradas(id);        
        if (result.length === 0) {     
            result = await auto.retunRutinaRDN();
        }              
        const rutinasAutogeneradasIds = result.map(obj => obj.rutinas_id);
        const nuevosIds = rutinasAutogeneradasIds.filter(id => !rutinasIds.includes(id));
        rutinasIds.push(...nuevosIds);
        
        usuarioObjetivos.rutinas_realizadas = rutinasIds;  

        result = await auto.rutinaSugerida(usuarioObjetivos);        
        
        if (result.length === 0) {     
            result =await auto.rutinaSugerida(0);
        }
       
        const idNewRotutine = result[0].id; 
        
        rutina = await auto.getById(idNewRotutine);
        
        const arrEjercicios = await auto.getByIdExercises(idNewRotutine); 

        const rutinaObject = rutina[0];
        const rutinaCompleta = generarJson(rutinaObject, arrEjercicios); 
        
        // const inserHeader = await auto.insertRutinaUsuario(rutinaCompleta.rutina_id, id); 

        // for (let i = 0; i < arrEjercicios.length; i++) {
        //     const objEjercicios = arrEjercicios[i];
        //     await auto.insertEjerciciosUsuario(objEjercicios, inserHeader);           
        // }
                        
        // auto.insertLogRutine(inserHeader, id);
        
        return res.status(201).json(rutinaCompleta);
    
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
   
}

module.exports = {
    autoGenerate
}