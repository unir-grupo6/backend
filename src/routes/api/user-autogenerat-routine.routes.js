const { autoGenerate } = require('../../controllers/user-autogenerate-routine.controller');
const { checkToken } = require('../../middlewares/auth.middlewares');
const router = require('express').Router();


router.post('/:id',checkToken, autoGenerate);
        
module.exports = router;