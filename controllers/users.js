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
    const body = {
        ...req.body,
        updatedAt: new Date(),
    }
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

const updateSubscription = async (req, res) => {
    const userId = req.params.userId
    const communityId = req.params.communityId

    try {
        const user = await db.User.findByPk(userId)
        const community = await db.Community.findByPk(communityId)

        if (!user || !community) {
            throw new Error('User or community not found')
        }

        const userIsSubscribed = await user.hasCommunity(community)

        if (userIsSubscribed) {
            await user.removeCommunity(community)
        } else {
            await user.setCommunities(community)
        }

        const updatedUser = await db.User.findByPk(userId)
        const tags = await updatedUser.getCommunities()

        const response = {
            ...updatedUser.toJSON(),
            tags,
        }

        res.status(201).send(response)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

// TODO:
const toggleAdminOrModerator = (option, req, res) => {}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateSubscription,
}
