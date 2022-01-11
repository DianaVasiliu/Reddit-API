const { GraphQLInputObjectType, GraphQLBoolean, GraphQLID, GraphQLNonNull } = require("graphql");

const updateCommentReactionInputType = new GraphQLInputObjectType({
  name: 'UpdateCommentReactionInputType',
  fields: {
    commentId: {
        type: new GraphQLNonNull(GraphQLID),
    },
    isUpvote: {
      type: new GraphQLNonNull(GraphQLBoolean),
    }
  }
});

module.exports = updateCommentReactionInputType;