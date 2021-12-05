'use strict'

const faker = require('faker')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = []
        for (let i = 0; i < 100; i++) {
            users.push({
                email: faker.internet.email(),
                username: faker.internet.userName(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }

        await queryInterface.bulkInsert('Users', users)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {})
    },
}
