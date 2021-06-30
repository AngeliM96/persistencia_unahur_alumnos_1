const express = require("express");
const router = express.Router();
const models = require('../models')

router.get("/", (req, res,next) => {
  const cantidadAVer = parseInt(req.query.cantidadAVer);
  const paginaActual = parseInt(req.query.paginaActual);
  
  models.profesor.findAll({
      attributes: ["id","nombre","apellido", "dni","id_materia"],
      include:[{as:'Materia-Relacionada', model:models.materia, attributes: ["id","nombre"]}],
      offset: (paginaActual - 1) * cantidadAVer, 
      limit: cantidadAVer
    }).then(profesor => res.send(profesor)).catch(error => { return next(error)});
});



router.post("/", (req, res) => {
  models.profesor
    .create({ 
      nombre: req.body.nombre, 
      apellido: req.body.apellido, 
      dni: req.body.dni, 
      id_carrera:req.body.id_carrera 
    })
    .then(profesor => res.status(201).send({ id: profesor.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro profesor con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ["id", "nombre", "apellido", "dni"],
      where: { id }
    })
    .then(profesor => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    findProfesor(req.params.id, {
    onSuccess: profesor => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = profesor =>
    profesor
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro profesor con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = profesor =>
    profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
