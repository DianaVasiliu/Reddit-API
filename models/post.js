'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            // define association here
            models.Post.belongsTo(models.User, {
                foreignKey: 'userId',
            })
            models.Post.belongsToMany(models.User, {
                through: models.PostReaction,
                timestamps: false,
            })
            models.Post.belongsTo(models.Community, {
                foreignKey: 'communityId',
            })
            models.Post.hasMany(models.Comment, {
                foreignKey: 'postId',
            })
        }
    }
    Post.init(
        {
            title: DataTypes.STRING,
            body: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Post',
        }
    )
    return Post
}
