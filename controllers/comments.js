const db = require('../models')

const getAllPostComments = async (req, res) => {
    const postId = req.params.postId

    try {
        const post = await db.Post.findByPk(postId)

        if (!post) {
            throw new Error('Post not found')
        }

        const comments = await db.Comment.findAll({
            where: {
                postId,
            },
        })

        res.send(comments)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const postNewComment = async (req, res) => {
    const body = req.body
    const userId = body.userId
    const postId = req.params.postId
    const replyToCommentId = body.replyToCommentId

    try {
        const post = await db.Post.findByPk(postId)
        const user = await db.User.findByPk(userId)

        if (!user || !post) {
            throw new Error('User or post not found')
        }

        if (replyToCommentId) {
            const comment = await db.Comment.findOne({
                where: {
                    postId,
                    id: replyToCommentId,
                },
            })

            if (!comment) {
                throw new Error('Cannot reply to inexistent comment')
            }
        }

        const newComment = await db.Comment.create({
            ...body,
            postId,
        })

        res.send(newComment)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getCommentThread = async (req, res) => {
    const postId = req.params.postId
    const commentId = req.params.commentId

    try {
        // get the parent
        const thread = await db.Comment.findOne({
            where: {
                id: commentId,
                postId,
                replyToCommentId: null,
            },
        })

        if (!thread) {
            throw new Error('Thread not found')
        }

        var ids = [thread.id]
        var threadMessages = [thread]

        while (ids.length) {
            // get the first id
            // and remove it
            let id = ids[0]
            ids.shift()

            // get all comments that are replies to the current comment
            let replies = await db.Comment.findAll({
                where: {
                    replyToCommentId: id,
                    postId,
                },
            })

            threadMessages = threadMessages.concat(replies)

            replies.forEach((reply) => {
                ids.push(reply.id)
            })
        }

        res.send(threadMessages)
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const updateComment = async (req, res) => {
    const postId = parseInt(req.params.postId)
    const commentId = parseInt(req.params.commentId)
    const reqBody = req.body
    const body = {
        body: reqBody.body,
        updatedAt: new Date(),
    }

    console.log('body', body)

    try {
        const comment = await db.Comment.findByPk(commentId)

        if (!comment) {
            throw new Error('Comment not found 1')
        }

        if (comment.toJSON().postId !== postId) {
            throw new Error('Comment not found')
        }

        await db.Comment.update(body, {
            where: {
                id: commentId,
            },
        })

        res.status(202).send('Comment updated successfully')
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deleteComment = async (req, res) => {
    const postId = parseInt(req.params.postId)
    const commentId = parseInt(req.params.commentId)

    try {
        const comment = await db.Comment.findByPk(commentId)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (comment.toJSON().postId !== postId) {
            throw new Error('Comment not found')
        }

        await db.Comment.destroy({
            where: {
                id: commentId,
            },
        })

        res.status(202).send('Comment deleted successfully')
    } catch (e) {
        console.error('Error:', e.message)
        res.send({
            error: 'Something went wrong',
        })
    }
}

module.exports = {
    getAllPostComments,
    postNewComment,
    getCommentThread,
    updateComment,
    deleteComment,
}
