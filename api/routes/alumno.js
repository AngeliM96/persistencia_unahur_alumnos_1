const express = require("express");
const router = express.Router();
const { getAlumno, getAlumnoId, postAlumno, deleteAlumno, updateAlumno } = require('../controllers/alumno');

router.get('/', getAlumno);
router.get('/:id', getAlumnoId);
router.post('/', postAlumno);
router.delete('/:id', deleteAlumno);
router.put('/:id', updateAlumno);

module.exports = router;
