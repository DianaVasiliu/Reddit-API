'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Users',
                    },
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Posts',
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            replyToCommentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'Comments',
                    },
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            body: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Comments')
    },
}
