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
      resolve: async (source, { ids }, context) => {
        let reactions = await db.CommentReaction.findAll({
          where: {
            commentId: source.id,
          },
        });

        return reactions.length;
      },
    },
  }),
});

module.exports = commentType;
