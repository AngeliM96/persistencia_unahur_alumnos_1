const express = require("express");
const router = express.Router();
const { getCarrera, getCarreraId, postCarrera, updateCarrera, deleteCarrera } = require('../controllers/carreras')

router.get("/", getCarrera);
router.get("/:id", getCarreraId);
router.post("/", postCarrera);
router.put("/:id", updateCarrera);
router.delete("/:id", deleteCarrera );

module.exports = router;