'use strict'

const faker = require('faker')
const db = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const messages = [];

        const allUsers = await db.User.findAll();

        for (let i = 0; i < 200; i++) {
            const fromIndex = Math.floor(Math.random() * (allUsers.length - 1));
            var toIndex = Math.floor(Math.random() * (allUsers.length - 1));

            while (toIndex === fromIndex) {
                toIndex = Math.floor(Math.random() * (allUsers.length - 1));
            }

            messages.push({
                userId: allUsers[fromIndex].id,
                toId: allUsers[toIndex].id,
                text: faker.lorem.sentence(),
                createdAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('Messages', messages);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Messages', null, {});
    },
}
