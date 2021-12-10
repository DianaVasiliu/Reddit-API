'use strict'

const faker = require('faker')
const db = require('../models')

module.exports = {
    up: async (queryInterface, Sequelize) => {},

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Comments', null, {})
    },
}
