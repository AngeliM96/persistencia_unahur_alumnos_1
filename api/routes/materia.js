const express = require("express");
const router = express.Router();
const { getMateria, getMateriaId, postMateria, updateMateria, deleteMateria } = require('../controllers/materia')

router.get("/", getMateria);
router.get("/:id", getMateriaId);
router.post("/", postMateria);
router.put("/:id", updateMateria );
router.delete("/:id", deleteMateria);

module.exports =  router;