// Contains all the logic for the users

const db = require('../models')

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await db.User.findAll()
        res.status(200).send(allUsers)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getUserById = async (req, res) => {
    const userID = req.params.id

    try {
        const selectedUser = await db.User.findByPk(userID)

        if (selectedUser === null) {
            res.status(404).send('User not found')
        } else {
            res.status(302).send(selectedUser)
        }
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const createUser = async (req, res) => {
    const { email, username } = req.body

    try {
        const newUser = await db.User.create({
            email,
            username,
        })

        res.status(201).send(newUser)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const updateUser = async (req, res) => {
    const body = req.body
    const userId = req.params.id

    try {
        await db.User.update(body, {
            where: {
                id: userId,
            },
        })

        const updatedUser = await db.User.findByPk(req.params.id)
        res.status(202).send(updatedUser)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deleteUser = async (req, res) => {
    const userID = req.params.id

    try {
        await db.User.destroy({
            where: {
                id: userID,
            },
        })
        res.status(202).send('User deleted successfully')
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}
