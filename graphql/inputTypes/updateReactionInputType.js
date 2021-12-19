const { GraphQLInputObjectType, GraphQLID, GraphQLNonNull, GraphQLBoolean, GraphQLString } = require("graphql");

const updateReactionInputType = new GraphQLInputObjectType({
  name: 'UpdateReactionInput',
  fields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    postId: { //Can be null since the reaction may be either on a post OR a comment
        type: GraphQLID,
      },
    commentId: {
        type: GraphQLID,
      },  
    isUpvote: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    option: {
        type: new GraphQLNonNull(GraphQLString),
    },
  }
});

module.exports = updateReactionInputType;