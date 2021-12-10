// Contains all the logic for the posts

const db = require('../models')

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await db.Post.findAll()
        res.status(200).send(allPosts)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getPostById = async (req, res) => {
    const postId = parseInt(req.params.id)

    try {
        const selectedPost = await db.Post.findByPk(postId)
        const author = await selectedPost.getUser()
        const community = await selectedPost.getCommunity()

        const response = {
            ...selectedPost.toJSON(),
            author,
            community,
        }

        if (selectedPost === null) {
            res.status(404).send('Post not found')
        } else {
            res.status(302).send(response)
        }
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const createPost = async (req, res) => {
    const userId = parseInt(req.params.id)

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const newPost = req.body

        const createdPost = await user.createPost(newPost)

        res.status(201).send(createdPost)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const updatePost = async (req, res) => {
    const body = {
        ...req.body,
        updatedAt: new Date(),
    }
    const postId = parseInt(req.params.id)

    try {
        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        await db.Post.update(body, {
            where: {
                id: postId,
            },
        })

        const updatedPost = await db.Post.findByPk(postId)
        res.status(202).send(updatedPost)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id)

    try {
        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        await db.Post.destroy({
            where: {
                id: postId,
            },
        })

        res.status(202).send('Post deleted successfully')
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
}
