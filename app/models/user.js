const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Book)
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    timestamps: true,
    underscored: true,
    paranoid: true,
    modelName: 'User',
    tableName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password', 'created_at', 'updated_at' ,'deleted_at', 'refreshToken']
      }
    }
  });

  return User;
};