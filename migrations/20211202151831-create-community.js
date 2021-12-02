'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Communities', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            description: {
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
            'UserCommunity',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                userId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: {
                            tableName: 'Users',
                        },
                        key: 'id',
                    },
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
                },
                isCreator: {
                    type: Sequelize.TINYINT,
                    defaultValue: 0,
                },
                isModerator: {
                    type: Sequelize.TINYINT,
                    defaultValue: 0,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['userId', 'communityId'],
                    },
                },
            }
        )
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Communities')
        await queryInterface.dropTable('UserCommunity')
    },
}
