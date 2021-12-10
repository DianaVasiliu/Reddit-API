'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserCommunity extends Model {}
    UserCommunity.init(
        {
            isCreator: DataTypes.INTEGER,
            isModerator: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'UserCommunity',
            tableName: 'UserCommunity',
            timestamps: false,
        }
    )
    return UserCommunity
}
