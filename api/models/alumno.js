'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {tableName: 'alumno'});
  alumno.associate = function(models) {
  	alumno.belongsTo(models.carrera
    ,{
      as : 'Carrera-Relacionada',
      foreignKey: 'id_carrera'
    })
  };
  return alumno;
};