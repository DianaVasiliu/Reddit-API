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
    const userID = parseInt(req.params.id)

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
    const userId = parseInt(req.params.id)

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        await db.User.update(body, {
            where: {
                id: userId,
            },
        })

        const updatedUser = await db.User.findByPk(userId)
        res.status(202).send(updatedUser)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id)

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        await db.User.destroy({
            where: {
                id: userId,
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
    const userId = parseInt(req.params.userId)
    const communityId = parseInt(req.params.communityId)

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
        const subscriptions = await updatedUser.getCommunities()

        const response = {
            ...updatedUser.toJSON(),
            subscriptions,
        }

        res.status(201).send(response)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const toggleAdminOrModerator = async (option, req, res) => {
    const communityId = parseInt(req.params.communityId)
    const userId = parseInt(req.params.userId)
    var criteria

    try {
        if (option === 'admin') {
            criteria = {
                isAdmin: 1,
            }
        } else if (option === 'moderator') {
            criteria = {
                isModerator: 1,
            }
        } else {
            throw new Error('Invalid option')
        }

        // check if the user we want to update is a member of the community
        const user = await db.UserCommunity.findOne({
            where: {
                userId,
                communityId,
            },
        })

        if (!user) {
            throw new Error(
                'There required user/community does not exist or is not a member of the community'
            )
        }

        // check if we want to remove the only admin
        // if the option is 'admin', then we count the admins of the community
        if (option === 'admin') {
            // if we want to remove the current admin
            if (user.toJSON().isAdmin === 1) {
                // check if this admin is the creator of the community
                const creator = await db.Community.findOne({
                    where: {
                        id: communityId,
                        userId,
                    },
                })

                if (creator) {
                    throw new Error('Cannot remove the creator as admin')
                }

                // check if he is the only admin of the community
                const users = await db.UserCommunity.findAll({
                    where: {
                        communityId,
                        isAdmin: 1,
                    },
                })

                // if we only have one admin, we cannot remove it
                if (users.length <= 1) {
                    throw new Error('Cannot have community without admin')
                } else {
                    await db.UserCommunity.update(
                        {
                            isAdmin: 0,
                        },
                        {
                            where: {
                                userId,
                                communityId,
                            },
                        }
                    )
                }
            } else {
                await db.UserCommunity.update(
                    {
                        isAdmin: 1,
                        isModerator: 1,
                    },
                    {
                        where: {
                            userId,
                            communityId,
                        },
                    }
                )
            }
        } else {
            if (user.toJSON().isAdmin === 1) {
                throw new Error('Cannot update moderator role of an admin')
            }
            await db.UserCommunity.update(
                {
                    isModerator: 1 - user.toJSON().isModerator,
                },
                {
                    where: {
                        userId,
                        communityId,
                    },
                }
            )
        }

        res.status(201).send('User role updated successfully')
    } catch (e) {
        console.error('Error:', e.message)
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
    updateSubscription,
    toggleAdminOrModerator,
}
