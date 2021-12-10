'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // define association here
            models.Message.belongsTo(models.User, {
                foreignKey: 'userId',
            })
        }
    }
    Message.init(
        {
            userId: DataTypes.INTEGER,
            toId: DataTypes.INTEGER,
            text: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Message',
            updatedAt: false,
        }
    )
    return Message
}
