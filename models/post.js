'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            // define association here
            models.Post.belongsTo(models.User, {
                foreignKey: 'userId',
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
