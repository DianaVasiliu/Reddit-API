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
            let userIndex = Math.floor(Math.random() * (allUsers.length - 1));
            const communityIndex =
                Math.floor(Math.random() * (allCommunities.length - 1));

            posts.push({
                id: i + 1,
                userId: allUsers[userIndex].id,
                communityId: allCommunities[communityIndex].id,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            userIndex = Math.floor(Math.random() * (allUsers.length - 1));
            postReactions.push({
                userId: allUsers[userIndex].id,
                postId: i + 1,
                isUpvote: Math.random() > 0.5 ? 1 : 0,
            });
        }

        await queryInterface.bulkInsert('Posts', posts);
        await queryInterface.bulkInsert('PostReaction', postReactions);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('PostReaction', null, {})
        await queryInterface.bulkDelete('Posts', null, {})
    },
}
