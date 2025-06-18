const {getAll, getById} = require('../../controllers/goals.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/:id', getById);

// Define your routes here

module.exports = router;