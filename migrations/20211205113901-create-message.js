'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(
            'Messages',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
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
                toId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: {
                            tableName: 'Users',
                        },
                        key: 'id',
                    },
                    onDelete: 'SET NULL',
                },
                text: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            {
                updatedAt: false,
            }
        )
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Messages')
    },
}
