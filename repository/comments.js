const db = require('../models')

const getAllPostComments = async (req, res) => {
    const postId = parseInt(req.params.postId)

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

const postNewComment = async (args, context) => {
    const { body,
            userId,
            postId, } = args
    const replyToCommentId = body.replyToCommentId
    const { user } = context

    if (!user) {
        console.log(
            'Unauthenticated user cannot post comments'
            )
        return null;
    }

    try {
        const post = await db.Post.findByPk(postId)
        const userInDB = await db.User.findByPk(userId)

        if (!userInDB || !post) {
            throw new Error('User or post not found')
        }

        if (userId != user.id) {
            throw new Error(
                'User can only post comments using is own id'
                )
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

        return newComment;
    } catch (e) {
        console.error('Error:', e.message)
        return {
            error: 'Something went wrong',
        }
    }
}

const getCommentThread = async (id) => {
    const commentId = id;

    try {
        // get the parent
        const thread = await db.Comment.findOne({
            where: {
                id: commentId,
                replyToCommentId: null,
            },
        })

        if (!thread) {
            throw new Error ('Thread not found');
        }

        let ids = [thread.id];
        let threadMessages = [thread];

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

        return threadMessages;
    } catch (e) {
        console.error('Error:', e.message)
        return {
            error: 'Something went wrong',
        }
    }
}

const updateComment = async (args, context) => {
    const { postId,
            commentId,
            reqBody, } = args
    const body = {
        body: reqBody.body,
        updatedAt: new Date(),
    }
    const { user } = context

    if (!user) {
        console.log(
            'Unauthenticated user cannot post comments'
            )
        return null;
    }

    try {
        const comment = await db.Comment.findByPk(commentId)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (comment.toJSON().postId !== postId) {
            throw new Error('Comment not found')
        }

        if (comment.toJSON().userId != user.id) {
            throw new Error(
                'User can only post comments using is own id'
                )
        }

        await db.Comment.update(body, {
            where: {
                id: commentId,
            },
        })

        const updatedComment = await db.Comment.findByPk(commentId)

        return updatedComment
    } catch (e) {
        console.error('Error:', e.message)
        return {
            error: 'Something went wrong',
        }
    }
}

const deleteComment = async (args, context) => {
    const { postId,
            commentId,} = args
    const { user } = context

    if (!user) {
        console.log(
            'Unauthenticated user cannot delete comments'
        )
        return null;
    }

    try {
        const comment = await db.Comment.findByPk(commentId)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (comment.toJSON().postId !== postId) {
            throw new Error('Comment not found')
        }

        //checking whether user is deleting his own comment or a moderator is deleting someone else's comment
        const post = await db.Post.findByPk(postId)
        const { userId,
                communityId,} = post.toJSON()
        const userCommunity = await db.userCommunity.findOne({
            where: {
                userId,
                communityId,
            },
        })

        if (user.id !== userId && !userCommunity.toJSON().isModerator) {
            throw new Error(
                'User cannot delete a comment that is not his own when he is not a moderator'
            )
        }

        await db.Comment.destroy({
            where: {
                id: commentId,
            },
        })

        return comment
    } catch (e) {
        console.error('Error:', e.message)
        return {
            error: 'Something went wrong',
        }
    }
}

const getAllCommentReactions = async (req, res) => {
    const commentId = parseInt(req.params.commentId)

    try {
        const comment = await db.Comment.findByPk(commentId)

        if (!comment) {
            throw new Error('Comment not found')
        }

        const reactions = await db.CommentReaction.findAll({
            where: {
                commentId,
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
    getAllPostComments,
    postNewComment,
    getCommentThread,
    updateComment,
    deleteComment,
    getAllCommentReactions,
}
