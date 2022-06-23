// Documentation regarding Data Types can be found here
// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
      
      text: DataTypes.TEXT,
    });
  
    return Note;
  };