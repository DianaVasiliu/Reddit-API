const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
  
  const postReactionType = new GraphQLObjectType({
    name: 'PostReaction',
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
      isUpvote: {
        type: GraphQLBoolean,
      },
    }),
  });
  
  module.exports = postReactionType;