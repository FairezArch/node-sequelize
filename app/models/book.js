const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User)
        }
    }
    Book.init({
        name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
    }, {
        sequelize,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        timestamps: false,
        underscored: true,
        paranoid: true,
        modelName: 'Book',
        tableName: 'books',
    });


    return Book;
};