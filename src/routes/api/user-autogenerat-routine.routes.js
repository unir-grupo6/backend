const { autoGenerate } = require('../../controllers/user-autogenerate-routine.controller');

const router = require('express').Router();


router.post('/:id', autoGenerate);
        
module.exports = router;