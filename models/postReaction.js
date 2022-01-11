'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostReaction extends Model {
        static associate(models) {
            models.PostReaction.belongsTo(models.User, {
                foreignKey: 'userId',
            });
            models.PostReaction.belongsTo(models.Post, {
                foreignKey: 'postId',
            });
        }
    }
    PostReaction.init(
        {
            id: {
                type: DataTypes.TINYINT,
                primaryKey: true,
            },
            isUpvote: DataTypes.TINYINT,
        },
        {
            sequelize,
            modelName: 'PostReaction',
            tableName: 'PostReaction',
            timestamps: false,
        }
    );

    return PostReaction;
};
