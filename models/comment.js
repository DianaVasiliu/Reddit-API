'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            // define association here
            models.Comment.belongsTo(models.User, {
                foreignKey: 'userId',
            })
            models.Comment.belongsToMany(models.User, {
                through: models.CommentReaction,
                timestamps: false,
                foreignKey: 'userId',
                otherKey: 'commentId'
            })
            models.Comment.belongsTo(models.Post, {
                foreignKey: 'postId',
            })
            models.Comment.hasMany(models.Comment, {
                as: 'Replies',
                foreignKey: 'replyToCommentId',
            })
        }
    }
    Comment.init(
        {
            userId: DataTypes.INTEGER,
            postId: DataTypes.INTEGER,
            replyToCommentId: DataTypes.INTEGER,
            body: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Comment',
        }
    )
    return Comment
}
