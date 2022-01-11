const db = require('../models');

const updatePostReaction = async (args, context) => {
    const { postId, isUpvote } = args;
    const { user } = context;

    if (!user) {
        throw new Error('Unauthenticated user cannot react to post');
    }

    try {
        const post = await db.Post.findByPk(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        let reaction = await db.PostReaction.findOne({
            where: {
                postId,
                userId: user.id,
            },
        });

        console.log(reaction);
        /*if (!reaction) {
            reaction = await db.PostReaction.create({
                    postId: parseInt(postId),
                    isUpvote,
                    userId: user.id,
                });
        } else {
            reaction.isUpvote = isUpvote;
            reaction.save();
        }*/

        return reaction;
    } catch (e) {
        throw new Error(e.message);
    }
};

const updateCommentReaction = async (args, context) => {
    const { commentId, isUpvote } = args;
    const { user } = context;

    if (!user) {
        console.log('Unauthenticated user cannot react to comment');
        return null;
    }

    try {
        const comment = await db.Comment.findByPk(postId);

        if (!comment) {
            throw new Error('Post not found');
        }

        let reaction = await db.CommentReaction.findOne({
            where: {
                commentId,
                isUpvote,
                userId: user.id,
            },
        });

        if (!reaction) {
            reaction = await db.CommentReaction.create({
                commentId,
                isUpvote,
                userId: user.id,
            });
        } else {
            reaction.update({ isUpvote });
        }

        return reaction;
    } catch (e) {
        console.error('Error:', e.message);
        return {
            error: 'Something went wrong',
        };
    }
};

module.exports = {
    updateCommentReaction,
    updatePostReaction,
};
