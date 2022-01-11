const db = require('../models')

const getAllCommunities = async () => {
    try {
        const allCommunities = await db.Community.findAll();
        return allCommunities;
    } catch (error) {
        return {
            error
        };
    }
}

const getCommunity = async (id) => {
    const communityId = id;

    try {
        const selectedCommunity = await db.Community.findByPk(communityId);
        return selectedCommunity;
    } catch (error) {
        return {
            error
        };
    }
}

// NOTE can be done through graphQL
const getAllCommunityPosts = async (req, res) => {
    const communityId = parseInt(req.params.communityId)

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

// NOTE can be done through graphQL
const getCommunityPost = async (req, res) => {
    const communityId = parseInt(req.params.communityId)
    const postId = parseInt(req.params.postId)

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

// NOTE added to graphql
const getAllCommunityMembers = async (req, res) => {
    const communityId = parseInt(req.params.communityId)

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

// NOTE added to graphql
const getCommunityAdminsOrModerators = async (option, req, res) => {
    const communityId = parseInt(req.params.communityId)
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

const createCommunity = async (args, context) => {
    const {
        name,
        description
    } = args;
    const {
        user
    } = context;

    if (!user) {
        throw new Error('Unauthenticated users cannot create communities');
    }

    try {
        const createdCommunity = await db.Community.create({
            name,
            description,
            'userId': user.id
        });

        await createdCommunity.addUser(user, {
            through: {
                isAdmin: 1,
                isModerator: 1,
            },
        })

        return createdCommunity;
    } catch (e) {
        return {
            error
        };
    }
}

const updateCommunity = async (args, context) => {
    const {
        communityId,
        name,
        description
    } = args;

    const {
        user
    } = context;

    const userId = user.id;

    if (!user) {
        throw new Error('Unauthenticated users cannot update communities');
    }

    const selectedCommunity = await db.Community.findByPk(communityId);
    const selectedUserCommunity = await db.UserCommunity.findOne({
        where: {
            userId,
            communityId
        },
    })

    // check if the user who wants to update the community is a member of it and an admin or moderator
    if (!selectedCommunity) {
        throw new Error('Community not found');
    }
    else if (!selectedUserCommunity) {
        throw new Error('Currently logged in user is not a member of the community');
    }
    else if (selectedUserCommunity.isAdmin !== 1) {
        throw new Error('Currently logged in user is not an admin for the community');
    }

    try {
        await db.Community.update({
            name,
            description,
        }, {
            where: {
                id: communityId
            }
        });
        
        let returnCommunity = await db.Community.findByPk(communityId);
        console.log(returnCommunity);
        return returnCommunity;
    } catch (error) {
        throw new Error(error);
    }
}

const deleteCommunity = async (communityId, context) => {
    const { user } = context;
    const { id } = user;
    const criteria = {
        userId: id,
        communityId,
    };

    const community = await db.Community.findByPk(communityId);

    if (!community) {
        throw new Error('Community not found');
    }

    if (!user) {
        throw new Error('Unauthenticated users cannot delete communities');
    }

    const selectedUserCommunity = await db.UserCommunity.findOne({
        where: criteria,
    });

    if (!selectedUserCommunity) {
        throw new Error(
            'Currently logged in user is not a member of the community that is to be deleted'
        );
    } else if (selectedUserCommunity.toJSON().isAdmin !== 1) {
        throw new Error(
            'Currently logged in user is not an admin of the community that is to be deleted'
        );
    }

    try {
        await db.Community.destroy({
            where: {
                id: communityId,
            },
        });

        return community;
    } catch (e) {
        console.error(e);
        throw new Error('Something went wrong');
    }
};

module.exports = {
    getAllCommunities,
    getCommunity,
    getAllCommunityPosts,
    getCommunityPost,
    getAllCommunityMembers,
    getCommunityAdminsOrModerators,
    createCommunity,
    updateCommunity,
    deleteCommunity,
}