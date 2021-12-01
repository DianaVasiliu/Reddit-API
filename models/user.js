'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            models.User.hasMany(models.Post)
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            username: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        }
    )
    return User
}
