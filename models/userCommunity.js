'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserCommunity extends Model {
        static associate(models) {
            models.UserCommunity.belongsTo(models.User, {
                foreignKey: 'userId',
            });
            models.UserCommunity.belongsTo(models.Community, {
                foreignKey: 'communityId',
            });
        }
    }
    UserCommunity.init(
        {
            isAdmin: DataTypes.INTEGER,
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
