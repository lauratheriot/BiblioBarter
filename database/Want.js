/* eslint-disable @typescript-eslint/indent */
// WANT table is the books the user would like / need
module.exports = (sequelize, DataTypes) => {
  const Want = sequelize.define('want', {
    id_want: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    // id_user: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: User,
    //     key: 'id_user',
    //     deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE,
    //   },
    // },
    isbn: DataTypes.TEXT,
    title: DataTypes.TEXT,
    condition: DataTypes.TEXT,
    image_link: {
      type: DataTypes.TEXT,
      defaultValue: '../../../../assets/img/book.png',
    },
    fulfilled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Want.associate = (models) => {
    Want.belongsTo(models.User, { foreignKey: 'id_user' });
  };
  return Want;
};
