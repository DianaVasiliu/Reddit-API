const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require('graphql');
const db = require('../../models');

const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    userId: {
      type: GraphQLID,
    },
    postId: {
      type: GraphQLID,
    },
    replyToCommentId: {
      type: GraphQLID,
    },
    body: {
      type: GraphQLString,
    },
    reactions: {
      type: GraphQLInt,
      resolve: async (source) => {
        let upvoteReactions = await db.CommentReaction.findAll({
          where: {
            commentId: source.id,
            isUpvote: true
          },
        });

        let downvoteReactions = await db.CommentReaction.findAll({
          where: {
            commentId: source.id,
            isUpvote: false
          },
        });

        return upvoteReactions.length - downvoteReactions.length;
      },
    },
  }),
});

module.exports = commentType;
