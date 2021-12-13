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

        await queryInterface.createTable(
            'CommentReaction',
            {
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
                    onDelete: 'CASCADE',
                },
                commentId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'Comments',
                        },
                        key: 'id',
                    },
                    onDelete: 'CASCADE',
                },
                isUpvote: {
                    type: Sequelize.TINYINT,
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['userId', 'commentId'],
                    },
                },
                timestamps: false,
            }
        )
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('CommentReaction')
        await queryInterface.dropTable('Comments')
    },
}
