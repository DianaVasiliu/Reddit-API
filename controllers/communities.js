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

// TODO
const createCommunity = async (req, res) => {}

module.exports = {
    getAllCommunityPosts,
    getCommunityPost,
    getAllCommunityMembers,
    getCommunityAdminsOrModerators,
}
