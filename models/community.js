'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Community extends Model {
        static associate(models) {
            // define association here
            models.Community.belongsToMany(models.User, {
                through: models.UserCommunity,
                timestamps: false,
            })
            models.Community.hasMany(models.Post, {
                foreignKey: 'communityId',
            })
        }
    }
    Community.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Community',
        }
    )
    return Community
}
