'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class PostReaction extends Model {
        static associate(models) {
            models.PostReaction.belongsTo(models.User)
            models.PostReaction.belongsTo(models.Post)
        }
    }
    PostReaction.init(
        {
            isUpvote: DataTypes.TINYINT,
        },
        {
            sequelize,
            modelName: 'PostReaction',
            tableName: 'PostReaction',
            timestamps: false,
        }
    )
    return PostReaction
}
