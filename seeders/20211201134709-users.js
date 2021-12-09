'use strict'

// Contains the CRUD operations on Users table

const faker = require('faker')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const users = []
        for (let i = 0; i < 100; i++) {
            users.push({
                id: i,
                email: faker.internet.email(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
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
