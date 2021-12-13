'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            models.User.hasMany(models.Post, {
                foreignKey: 'userId',
            })
            models.User.belongsToMany(models.Post, {
                through: models.PostReaction,
                timestamps: false,
            })
            models.User.belongsToMany(models.Comment, {
                through: models.CommentReaction,
                timestamps: false,
            })
            models.User.belongsToMany(models.Community, {
                through: models.UserCommunity,
                timestamps: false,
            })
            models.User.hasMany(models.Community, {
                foreignKey: 'userId',
            })
            models.User.hasMany(models.UserCommunity)
            models.User.hasMany(models.Message, {
                foreignKey: 'userId',
            })
            models.User.hasMany(models.Comment, {
                foreignKey: 'userId',
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
