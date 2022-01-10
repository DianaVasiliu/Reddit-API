const { GraphQLInputObjectType, GraphQLBoolean, GraphQLID, GraphQLNonNull } = require("graphql");

const updatePostReactionInputType = new GraphQLInputObjectType({
  name: 'UpdatePostReactionInputType',
  fields: {
    commentId: {
        type: new GraphQLNonNull(GraphQLID),
    },
    isUpvote: {
      type: new GraphQLNonNull(GraphQLBoolean),
    }
  }
});

module.exports = updatePostReactionInputType;