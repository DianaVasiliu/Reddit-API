// Contains all the logic for the posts

const db = require('../models')

const getAllPosts = async () => {
    try {
        const allPosts = await db.Post.findAll()
        return allPosts
    } catch (error) {
        console.error('Something went wrong')
        return null
    }
}

const getPostById = async (id) => {
    const postId = id

    try {
        const selectedPost = await db.Post.findByPk(postId)
        return selectedPost
    } catch (error) {
        console.error('Something went wrong')
        return null
    }
}

const createPost = async (args, context) => {
    const { title, body } = args
    const { user } = context

    if (!user) {
        console.log(
            'Tried to create a post without being logged in. (without having a token in Authorization header)\n'
        )
        return null
    }

    try {
        const newPost = await db.Post.create({
            title,
            body,
            author: user,
        })

        return newPost
    } catch (error) {
        console.error(error)
        return null
    }
}

const updatePost = async (args, context) => {
    const { id, title, body } = args
    const selectedPost = await db.Post.findByPk(id)
    const { user } = context

    if (!user) {
        console.log(
            'Tried to update a post without being logged in. (without having a token in Authorization header)\n'
        )
        return null
    }

    if (selectedPost.userId != user.id) {
        console.log('Tried to update a post without being the author\n')
        return null
    }

    try {
        await db.Post.update(
            {
                title,
                body,
            },
            {
                where: {
                    id,
                },
            }
        )

        return await db.Post.findByPk(id)
    } catch (e) {
        console.error(e)
        return null
    }
}

const deletePost = async (args, context) => {
    const { id } = args

    const { user } = context
    const selectedPost = await db.Post.findByPk(id)

    if (!user) {
        console.log(
            'Tried to delete a post without being logged in. (without having a token in Authorization header)\n'
        )
        return null
    }

    if (selectedPost.userId != user.id) {
        console.log('Tried to delete a post without being the author\n')
        return null
    }

    try {
        await db.Post.destroy({
            where: {
                id,
            },
        })
        return {
            result: 'Post deleted succesfully.',
        }
    } catch (e) {
        console.error(e)
        return null
    }
}

const getAllPostReactions = async (req, res) => {
    const postId = parseInt(req.params.postId)

    try {
        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        const reactions = await db.PostReaction.findAll({
            where: {
                postId,
            },
        })

        const upvotes = reactions.filter((reaction) => reaction.isUpvote === 1)
        const nrUpvotes = upvotes.length
        const nrDownvotes = reactions.length - nrUpvotes

        const response = {
            upvotes: nrUpvotes,
            downvotes: nrDownvotes,
        }

        res.send(response)
    } catch (e) {
        console.error('Error:', e.message)
        res.send('Something went wrong')
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getAllPostReactions,
}
