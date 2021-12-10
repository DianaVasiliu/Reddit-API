'use strict'

const faker = require('faker')
const db = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const communities = []
        const usercommunities = []
        const users = await db.User.findAll()

        for (let i = 0; i < 100; i++) {
            let name = faker.lorem.slug().replaceAll('-', ' ')
            let userId = Math.floor(Math.random() * (users.length - 1)) + 1

            communities.push({
                id: i + 1,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                description: faker.lorem.sentences(),
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            usercommunities.push({
                userId,
                communityId: i + 1,
                isAdmin: 1,
                isModerator: 1,
            })
        }

        await queryInterface.bulkInsert('Communities', communities)
        await queryInterface.bulkInsert('UserCommunity', usercommunities)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('UserCommunity', null, {})
        await queryInterface.bulkDelete('Communities', null, {})
    },
}
