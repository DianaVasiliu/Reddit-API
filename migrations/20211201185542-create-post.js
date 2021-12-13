'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Posts', {
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
            communityId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Communities',
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            title: {
                type: Sequelize.STRING,
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
            'PostReaction',
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
                isUpvote: {
                    type: Sequelize.TINYINT,
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['userId', 'postId'],
                    },
                },
                timestamps: false,
            }
        )
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('PostReaction')
        await queryInterface.dropTable('Posts')
    },
}
