'use strict'

const faker = require('faker')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const communities = []

        for (let i = 0; i < 100; i++) {
            let name = faker.lorem.slug().replaceAll('-', ' ')
            communities.push({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                description: faker.lorem.sentences(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }

        await queryInterface.bulkInsert('Communities', communities)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('UserCommunity', null, {})
        await queryInterface.bulkDelete('Communities', null, {})
    },
}
