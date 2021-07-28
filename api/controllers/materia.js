const models = require('../models');

const getMateria = (req, res) => {
    const paginaActual = parseInt(req.query.paginaActual);
    const cantidadAVer = parseInt(req.query.cantidadAVer);

    models.materia
        .findAll({
            attributes: ["id", "nombre","id_carrera"],
            include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      offset: (paginaActual - 1) * cantidadAVer, 
      limit: cantidadAVer   
        })
        .then(materias => res.send(materias))
        .catch(() => res.sendStatus(500));
};

const postMateria = (req, res) => {
    models.materia
        .create({ nombre: req.body.nombre,id_carrera:req.body.id_carrera })
        .then(materia => res.status(201).send({ id: materia.id }))
        .catch(error => {
            if (error === "SequelizeUniqueConstraintError: Validation error") {
                res.status(400).send('Bad request: existe otra materia con el mismo nombre')
            }
            else {
                console.log(`Error al intentar insertar en la base de datos: ${error}`)
                res.sendStatus(500)
            }
        });
};

const findMateria = (id,{ onSuccess, onNotFound, onError}) =>{
    models.materia
        .findOne({
            attributes: ["id","nombre", "id_carrera"],
            where: { id }
        })
        .then(materia => (materia ? onSuccess(materia) : onNotFound()))
        .catch( () => onError())
};

const getMateriaId = (req, res) => {
    findMateria( req.params.id, {
        onSuccess: materia => res.send(materia),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });
};

const updateMateria = (req, res) => {
    const onSuccess = materia =>
        materia
            .update(
                { nombre: req.body.nombre }, 
                { fields: ["nombre"] }
            )
            .then(() => res.sendStatus(200))
            .catch(error => {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otra materia con el mismo nombre')
                }
                else {
                    console.log(`Error al intentar actualizar la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            });
        findmateria(req.params.id, {
            onSuccess,
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
            });
};

const deleteMateria = (req, res) => {
    const onSuccess = materia =>
        materia
            .destroy()
            .then( () => res.sendStatus(200))
            .catch( () => res.sendStatus(500));
    findMateria(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(400),
        onError: () => res.sendStatus(500)
    });
};

module.exports = { getMateria, getMateriaId, postMateria, updateMateria, deleteMateria };