const db = require('../models')

const getAllCommunityPosts = async (req, res) => {
    const communityId = req.params.communityId

    try {
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
    let error = 'Something went wrong'

    try {
        const post = await db.Post.findOne({
            where: {
                id: postId,
                communityId,
            },
        })

        if (!post) {
            error = 'Post not found'
            throw new Error(error)
        }

        res.send(post)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error,
        })
    }
}

const getAllCommunityMembers = async (req, res) => {
    const communityId = req.params.communityId

    try {
        const community = await db.Community.findByPk(communityId)

        const memberIds = await community.getUsers()

        console.log('memberIds', memberIds)
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
            criteria = '$Communities.UserCommunity.isCreator$'
        } else if (option === 'moderators') {
            criteria = '$Communities.UserCommunity.isModerator$'
        } else {
            throw new Error('Wrong option')
        }

        const moderators = await db.User.findAll({
            include: [
                {
                    model: db.Community,
                    as: 'Communities',
                    where: {
                        '$Communities.UserCommunity.communityId$': communityId,
                        [criteria]: 1,
                    },
                },
            ],
        })

        if (moderators.length == 0) {
            res.send('Database error: No moderator found')
        } else {
            res.send(moderators)
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

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const createdCommunity = await db.Community.create(body)
        // TODO: make the user a creator in the UserCommunity table
        await createdCommunity.addUser(user)

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
