const auto = require('../models/user-autogenerate-routine.model');

const autoGenerate = async (req, res) => {
    try{
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid idUser' });
        }

        const result = await auto.autoGenerate(id);
        console.log(result, ' - VALOR DE RESULTADO EN CONTROLADOR');        
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