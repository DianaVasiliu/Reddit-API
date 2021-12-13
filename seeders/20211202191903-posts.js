'use strict'

const faker = require('faker')
const db = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const allUsers = await db.User.findAll()
        const allCommunities = await db.Community.findAll()

        const posts = []
        const postReactions = []
        for (let i = 0; i < 200; i++) {
            const userId = Math.floor(Math.random() * (allUsers.length - 1)) + 1
            const communityId =
                Math.floor(Math.random() * (allCommunities.length - 1)) + 1

            posts.push({
                id: i + 1,
                userId,
                communityId,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            postReactions.push({
                userId,
                postId: i + 1,
                isUpvote: 1,
            })
        }

        await queryInterface.bulkInsert('Posts', posts)
        await queryInterface.bulkInsert('PostReaction', postReactions)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('PostReaction', null, {})
        await queryInterface.bulkDelete('Posts', null, {})
    },
}
