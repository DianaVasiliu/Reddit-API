'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CommentReaction extends Model {
        static associate(models) {
            models.CommentReaction.belongsTo(models.User, {
                foreignKey: 'userId',
            });
            models.CommentReaction.belongsTo(models.Comment, {
                foreignKey: 'commentId',
            });
        }
    }
    CommentReaction.init(
        {
            id: {
                type: DataTypes.TINYINT,
                primaryKey: true,
            },
            isUpvote: DataTypes.TINYINT,
        },
        {
            sequelize,
            modelName: 'CommentReaction',
            tableName: 'CommentReaction',
            timestamps: false,
        }
    );
    return CommentReaction;
};
