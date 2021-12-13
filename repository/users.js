// Contains all the logic for the graphql queries relating to users

const db = require('../models')

const getAllUsers = async () => {
    try {
        const allUsers = await db.User.findAll()
        return allUsers
    } catch (error) {
        console.error('Something went wrong')
        return null
    }
}

const getUserById = async (id) => {
    const userID = id

    try {
        const selectedUser = await db.User.findByPk(userID)
        return selectedUser
    } catch (error) {
        console.error('Something went wrong')
        return null
    }
}

const createUser = async (args) => {
    const { email, username, password } = args

    try {
        const newUser = await db.User.create({
            email,
            username,
            password,
        })

        return newUser
    } catch (error) {
        console.error(error)
        return null
    }
}

const updateUser = async (args, context) => {
    const { user } = context

    if (!user) {
        console.log(
            'Tried to update current user without being logged in. (without having a token in Authorization header)\n'
        )
        return null
    }

    const { id } = user

    const { email, username, password } = args

    try {
        const userInDB = await db.User.findByPk(id)

        if (!userInDB) {
            throw new Error('User not found')
        }

        await db.User.update(
            {
                email,
                username,
                password,
                updatedAt: new Date(),
            },
            { where: (id = id) }
        )

        return await db.User.findByPk(id)
    } catch (e) {
        console.error(e)
        return null
    }
}

const deleteUser = async (id) => {
    const userID = id

    try {
        const user = await db.User.findByPk(userID)

        if (!user) {
            throw new Error('User not found')
        }

        await db.User.destroy({
            where: {
                id: userID,
            },
        })
        return { result: 'User deleted succesfully.' }
    } catch (e) {
        console.error(e)
        return null
    }
}

//TODO: decide on parameter names for userId and communityId and update queryType
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
    const criteria = {
        userId,
        communityId,
    }

    try {
        if (option !== 'admin' && option !== 'moderator') {
            throw new Error('Invalid option')
        }

        // check if the user we want to update is a member of the community
        const user = await db.UserCommunity.findOne({
            where: criteria,
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
                            where: criteria,
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
                        where: criteria,
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
                    where: criteria,
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

const getUserReactions = async (req, res) => {
    const { id } = req.params

    try {
        const user = await db.User.findByPk(id)

        if (!user) {
            throw new Error('User not found')
        }

        const postReactions = await db.PostReaction.findAll({
            attributes: ['postId', 'isUpvote'],
            where: {
                userId: id,
            },
        })

        const posts = []
        await Promise.all(
            postReactions.map(async (postReaction) => {
                const post = await db.Post.findByPk(
                    postReaction.toJSON().postId
                )
                posts.push({
                    isUpvote: postReaction.isUpvote,
                    post: post.toJSON(),
                })
            })
        )

        res.send(posts)
    } catch (e) {
        console.error('Error:', e.message)
        res.send('Something went wrong')
    }
}

const updateReaction = async (option, req, res) => {
    const { userId, isUpvote } = req.body
    const { postId, commentId } = req.params
    var criteria = {
        userId,
        postId,
    }

    try {
        var response = 'Success'

        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        if (option === 'post') {
            const reaction = await db.PostReaction.findOne({
                attributes: ['isUpvote'],
                where: criteria,
            })

            var postReaction = null

            if (!reaction) {
                await post.addUser(user)

                await db.PostReaction.update(
                    {
                        isUpvote,
                    },
                    {
                        where: criteria,
                    }
                )

                postReaction = await db.PostReaction.findOne({
                    where: criteria,
                })
            } else {
                if (reaction.isUpvote === isUpvote) {
                    await db.PostReaction.destroy({
                        where: criteria,
                    })
                } else {
                    await db.PostReaction.update(
                        {
                            isUpvote,
                        },
                        {
                            where: criteria,
                        }
                    )

                    postReaction = await db.PostReaction.findOne({
                        where: criteria,
                    })
                }
            }

            if (!postReaction) {
                response = {
                    isUpvote: null,
                }
            } else {
                response = {
                    ...postReaction.toJSON(),
                    user,
                    post,
                }
            }
        } else if (option === 'comment') {
            const comment = await db.Comment.findByPk(commentId)

            if (!comment) {
                throw new Error('Comment not found')
            }

            criteria = {
                userId,
                commentId,
            }

            const reaction = await db.CommentReaction.findOne({
                attributes: ['isUpvote'],
                where: criteria,
            })

            var commentReaction = null

            if (!reaction) {
                await comment.addUser(user)

                await db.CommentReaction.update(
                    {
                        isUpvote,
                    },
                    {
                        where: criteria,
                    }
                )

                commentReaction = await db.CommentReaction.findOne({
                    where: criteria,
                })
            } else {
                if (reaction.isUpvote === isUpvote) {
                    await db.CommentReaction.destroy({
                        where: criteria,
                    })
                } else {
                    await db.CommentReaction.update(
                        {
                            isUpvote,
                        },
                        {
                            where: criteria,
                        }
                    )

                    commentReaction = await db.CommentReaction.findOne({
                        where: criteria,
                    })
                }
            }

            if (!commentReaction) {
                response = {
                    isUpvote: null,
                }
            } else {
                response = {
                    ...commentReaction.toJSON(),
                    user,
                    post,
                    comment,
                }
            }
        } else {
            throw new Error('Invalid option')
        }

        res.send(response)
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
    getUserReactions,
    updateReaction,
}
