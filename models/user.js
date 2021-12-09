'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            models.User.hasMany(models.Post)
            models.User.belongsToMany(models.Community, {
                through: 'UserCommunity',
            })
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        }
    )
    return User
}
