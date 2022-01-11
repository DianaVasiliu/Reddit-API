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
    const { user } = context;

    if (!user) {
        console.log(
            'Tried to update current user without being logged in. (without having a token in Authorization header)\n'
        );
        return null;
    }

    const { id } = user;
    const { email, username, password } = args;

    try {
        const userInDB = await db.User.findByPk(id);

        if (!userInDB) {
            throw new Error('User not found');
        }

        await db.User.update(
            {
                email,
                username,
                password,
                updatedAt: new Date(),
            },
            {
                where: {
                    id,
                },
            }
        );

        return await db.User.findByPk(id);
    } catch (e) {
        console.error(e);
        return null;
    }
};

const deleteUser = async (context) => {
    const { user } = context;

    if (!user) {
        console.log(
            'Tried to delete user without being logged in. (without having a token in Authorization header)\n'
        );
        return null;
    }

    const { id } = user;

    try {
        const userInDb = await db.User.findByPk(id);

        if (!userInDb) {
            throw new Error('User not found');
        }

        await db.User.destroy({
            where: {
                id,
            },
        });
        return { userInDb };
    } catch (e) {
        console.error(e);
        return null;
    }
};

const updateSubscription = async (communityId, context) => {
    const { user } = context;

    if (!user) {
        console.log(
            'Tried to update subscriptions of current user without being logged in. (without having a token in Authorization header)\n'
        );
        return null;
    }

    try {
        const community = await db.Community.findByPk(communityId);

        if (!community) {
            throw new Error('Community not found');
        }

        const userIsSubscribed = await user.hasCommunity(community);

        if (userIsSubscribed) {
            await user.removeCommunity(community);
        } else {
            await user.setCommunities(community);
        }

        const subscriptions = await user.getCommunities();

        return {
            user,
            subscriptions,
        };
    } catch (e) {
        console.error('Error:', e.message);
        return {
            error: 'Something went wrong',
        };
    }
};

const toggleAdminOrModerator = async (args, context) => {
    const { communityId, userId, option } = args;
    const criteria = {
        userId,
        communityId,
    };
    const { user } = context;

    if (!user) {
        console.log(
            'Tried to toggle privilege of user without being logged in. (without having a token in Authorization header)\n'
        );
        return null;
    }

    try {
        if (option !== 'admin' && option !== 'moderator') {
            throw new Error('Invalid option');
        }

        // check if the user we want to update is a member of the community
        const userCommunity = await db.UserCommunity.findOne({
            where: criteria,
        });

        if (!userCommunity) {
            throw new Error(
                'The required user/community does not exist or is not a member of the community'
            );
        }

        // check if we want to remove the only admin
        // if the option is 'admin', then we count the admins of the community
        if (option === 'admin') {
            // if we want to remove the current admin
            if (userCommunity.isAdmin === 1) {
                // check if this admin is the creator of the community
                const creator = await db.Community.findOne({
                    where: {
                        id: communityId,
                        userId,
                    },
                });

                if (creator) {
                    throw new Error('Cannot remove the creator as admin');
                }

                // check if he is the only admin of the community
                const users = await db.UserCommunity.findAll({
                    where: {
                        communityId,
                        isAdmin: 1,
                    },
                });

                // if we only have one admin, we cannot remove it
                if (users.length <= 1) {
                    throw new Error('Cannot own community without admin');
                } else {
                    await db.UserCommunity.update(
                        {
                            isAdmin: 0,
                        },
                        {
                            where: criteria,
                        }
                    );
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
                );
            }
        } else {
            if (userCommunity.isAdmin === 1) {
                throw new Error(
                    'Cannot update moderator role for someone who is also an admin'
                );
            }

            await db.UserCommunity.update(
                {
                    isModerator: 1 - userCommunity.isModerator,
                },
                {
                    where: criteria,
                }
            );
        }

        return userCommunity;
    } catch (e) {
        console.error('Error:', e.message);
        return {
            error: 'Something went wrong',
        };
    }
};

const getUserReactions = async (id) => {
    const userId  = id

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const postReactions = await db.PostReaction.findAll({
            attributes: ['postId', 'isUpvote'],
            where: {
                userId: userId,
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
                    post: post,
                })
            })
        )

        return posts
    } catch (e) {
        console.error('Error:', e.message)
        return { 'error': 'Something went wrong' }
    }
}

const updateReaction = async (args, context) => {
    const { userId, 
            isUpvote,
            postId,
            commentId, 
            option, } = args
    var criteria = {
        userId,
        postId,
    }
    const { user } = context

    if (!user) {
        console.log(
            'Tried to update a reaction without being logged in. (without having a token in Authorization header)\n'
        )
        return null
    }
    else {
        const { id } = user.toJSON();
        if (id != userId) {
            console.log(
                'Tried to update reaction of another user\n'
            )
            return null
        }
    }

    try {
        var response = 'Success'

        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        const userInDB = await db.User.findByPk(userId)

        if (!userInDB) {
            throw new Error('User not found')
        }

        if (option === 'post') {
            const reaction = await db.PostReaction.findOne({
                attributes: ['isUpvote'],
                where: criteria,
            })

            var postReaction = null

            if (!reaction) {
                await post.addUser(userInDB)

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
                    postReaction,
                    user: userInDB,
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
                await comment.addUser(userInDB)

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
                    commentReaction,
                    user: userInDB,
                    post,
                    comment,
                }
            }
        } else {
            throw new Error('Invalid option')
        }

        return response
    } catch (e) {
        console.error('Error:', e.message)
        return {
            error: 'Something went wrong',
        }
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
