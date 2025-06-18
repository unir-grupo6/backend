const { getAll, getById } = require('../../controllers/difficulty.controller');
const router = require('express').Router();

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
