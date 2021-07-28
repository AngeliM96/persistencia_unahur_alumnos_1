const express = require("express");
const router = express.Router();
const { getProfesor, getProfesorId, postProfesor, deleteProfesor, updateProfesor } = require('../controllers/profesor');

router.get('/', getProfesor);
router.get('/:id', getProfesorId);
router.post('/', postProfesor);
router.delete('/:id', deleteProfesor);
router.put('/:id', updateProfesor);

module.exports = router;
