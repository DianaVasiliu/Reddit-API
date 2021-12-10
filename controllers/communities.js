const db = require('../models')

const getAllCommunityPosts = async (req, res) => {
    const communityId = req.params.communityId

    try {
        const community = await db.Community.findByPk(communityId)

        if (!community) {
            throw new Error('Community not found')
        }

        const posts = await db.Post.findAll({
            where: {
                communityId,
            },
        })

        res.send(posts)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getCommunityPost = async (req, res) => {
    const communityId = req.params.communityId
    const postId = req.params.postId

    try {
        const post = await db.Post.findOne({
            where: {
                id: postId,
                communityId,
            },
        })

        if (!post) {
            throw new Error('Post not found')
        }

        res.send(post)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getAllCommunityMembers = async (req, res) => {
    const communityId = req.params.communityId

    try {
        const community = await db.Community.findByPk(communityId)

        if (!community) {
            throw new Error('Community not found')
        }

        const memberIds = await community.getUsers()

        res.send(memberIds)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getCommunityAdminsOrModerators = async (option, req, res) => {
    const communityId = req.params.communityId
    var criteria

    try {
        if (option === 'admins') {
            criteria = {
                isAdmin: 1,
            }
        } else if (option === 'moderators') {
            criteria = {
                isModerator: 1,
            }
        } else {
            throw new Error('Invalid option')
        }

        const community = await db.Community.findByPk(communityId)

        if (!community) {
            throw new Error('Community does not exist')
        }

        var users = await db.UserCommunity.findAll({
            attributes: ['userId'],
            where: {
                ...criteria,
                communityId,
            },
        })

        users = users.map((user) => user.toJSON().userId)

        if (users.length == 0) {
            res.send('Database error: No admin/moderator found')
        } else {
            users = await Promise.all(
                users.map(async (id) => {
                    const u = await db.User.findByPk(id)
                    return u
                })
            )
            res.send(users)
        }
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const createCommunity = async (req, res) => {
    const body = req.body
    const userId = req.params.userId

    // add the user as the creator of the community
    body.userId = userId

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const createdCommunity = await db.Community.create(body)
        await createdCommunity.addUser(user, {
            through: {
                isAdmin: 1,
                isModerator: 1,
            },
        })

        res.send(createdCommunity)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const updateCommunity = async (req, res) => {
    const body = {
        ...req.body,
        updatedAt: new Date(),
    }
    const communityId = req.params.id

    // cannot update the creator of a community
    if (body.userId) {
        delete body.userId
    }

    try {
        await db.Community.update(body, {
            where: {
                id: communityId,
            },
        })

        const updatedCommunity = await db.Community.findByPk(communityId)
        res.status(202).send(updatedCommunity)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deleteCommunity = async (req, res) => {
    const communityId = req.params.id

    try {
        const community = await db.Community.findByPk(communityId)

        if (!community) {
            throw new Error('Community not found')
        }

        await db.Community.destroy({
            where: {
                id: communityId,
            },
        })
        res.status(202).send('Community deleted successfully')
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

module.exports = {
    getAllCommunityPosts,
    getCommunityPost,
    getAllCommunityMembers,
    getCommunityAdminsOrModerators,
    createCommunity,
    updateCommunity,
    deleteCommunity,
}
