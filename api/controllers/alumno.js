const models = require('../models');

const getAlumno = (req, res, next) => {
    const paginaActual = parseInt(req.query.paginaActual);
    const cantidadAVer = parseInt(req.query.cantidadAVer);

    models.alumno.findAll({
      attributes: ["id","nombre","apellido","dni","id_carrera"],
      include:[{ as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      offset: (paginaActual - 1) * cantidadAVer, 
      limit: cantidadAVer       
    }).then(alumno => res.send(alumno)).catch(error => { return next(error)});
};

const postAlumno = (req, res) => {
    models.alumno
      .create({ 
        nombre: req.body.nombre, 
        apellido: req.body.apellido, 
        dni: req.body.dni, 
        id_carrera:req.body.id_carrera 
      })
      .then(alumno => res.status(201).send({ id: alumno.id }))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
};

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
      .findOne({
        attributes: ["id", "nombre", "apellido", "dni"],
        where: { id }
      })
      .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
      .catch(() => onError());
};

const getAlumnoId = (req, res) => {
    findAlumno(req.params.id, {
      onSuccess: alumno => res.send(alumno),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

const updateAlumno = (req, res) => {
    const onSuccess = alumno =>
      alumno
        .update(
          { nombre: req.body.nombre, apellido: req.body.apellido, dni: req.body.dni, id_carrera: req.body.id_carrera }, 
          { fields: ["nombre", "apellido", "dni", "id_carrera"] }
        )
        .then(() => res.sendStatus(200))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
          }
          else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
      findAlumno(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

const deleteAlumno = (req, res) => {
    const onSuccess = alumno =>
      alumno
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findAlumno(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

module.exports = { getAlumno, getAlumnoId, postAlumno, deleteAlumno, updateAlumno };