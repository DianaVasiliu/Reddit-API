const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
  
  const commentReactionType = new GraphQLObjectType({
    name: 'CommentReaction',
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      userId: {
        type: GraphQLID,
      },
      commentId: {
        type: GraphQLID,
      },
      isUpvote: {
        type: GraphQLBoolean,
      },
    }),
  });
  
  module.exports = commentReactionType;