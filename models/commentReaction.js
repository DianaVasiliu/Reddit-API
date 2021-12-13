'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class CommentReaction extends Model {
        static associate(models) {
            models.CommentReaction.belongsTo(models.User)
            models.CommentReaction.belongsTo(models.Comment)
        }
    }
    CommentReaction.init(
        {
            isUpvote: DataTypes.TINYINT,
        },
        {
            sequelize,
            modelName: 'CommentReaction',
            tableName: 'CommentReaction',
            timestamps: false,
        }
    )
    return CommentReaction
}
