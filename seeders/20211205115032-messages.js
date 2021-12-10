'use strict'

const faker = require('faker')
const db = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const messages = []

        const allUsers = await db.User.findAll()

        for (let i = 0; i < 200; i++) {
            const userId = Math.floor(Math.random() * (allUsers.length - 1)) + 1
            var toId = Math.floor(Math.random() * (allUsers.length - 1)) + 1

            while (toId === userId) {
                toId = Math.floor(Math.random() * (allUsers.length - 1)) + 1
            }

            messages.push({
                userId,
                toId,
                text: faker.lorem.sentence(),
                createdAt: new Date(),
            })
        }

        await queryInterface.bulkInsert('Messages', messages)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Messages', null, {})
    },
}
