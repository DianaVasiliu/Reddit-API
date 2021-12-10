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
                    onDelete: 'CASCADE',
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
                isAdmin: {
                    type: Sequelize.TINYINT,
                    defaultValue: 0,
                },
                isModerator: {
                    type: Sequelize.TINYINT,
                    defaultValue: 0,
                },
            },
            {
                uniqueKeys: {
                    actions_unique: {
                        fields: ['userId', 'communityId'],
                    },
                },
                timestamps: false,
            }
        )
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Communities')
        await queryInterface.dropTable('UserCommunity')
    },
}
