const { getAll, getById } = require('../../controllers/difficulties.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
