'use strict'

const faker = require('faker')
const db = require('../models')

const commentsNumber = 100;

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const comments = [];

        const posts = await db.Post.findAll();
        const users = await db.User.findAll();

        for (let i = 0; i < commentsNumber; i++) {
            const userIndex = Math.floor(Math.random() * (users.length - 1));
            const postIndex = Math.floor(Math.random() * (posts.length - 1));

            // TODO: add reply to comments in seeder
            comments.push({
                userId: users[userIndex].id,
                postId: posts[postIndex].id,
                body: faker.lorem.sentence(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('Comments', comments)
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Comments', null, {})
    },
}
