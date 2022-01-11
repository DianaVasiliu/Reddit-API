const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
const commentType = require('./commentType');
const userType = require('./userType');
  
  const commentReactionType = new GraphQLObjectType({
    name: 'CommentReaction',
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
      comment: {
        type: commentType,
        resolve: async (source) => {
          return await source.getComment();
        }
      },
      isUpvote: {
        type: GraphQLBoolean,
      },
    }),
  });
  
  module.exports = commentReactionType;