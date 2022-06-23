// Documentation regarding Data Types can be found here
// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    dueDate: DataTypes.DATEONLY,
    important: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Todo;
};
