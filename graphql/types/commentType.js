const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
  } = require('graphql');
  
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
    }),
  });
  
  module.exports = commentType;