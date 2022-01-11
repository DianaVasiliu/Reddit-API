const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require('graphql');
const db = require('../../models');
const postType = require('./postType');
const userType = require('./userType');

const commentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    user: {
      type: userType,
      resolve: async (source) => {
        return await source.getUser();
      }
    },
    post: {
      type: postType,
      resolve: async (source) => {
        return await source.getPost();
      }
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
