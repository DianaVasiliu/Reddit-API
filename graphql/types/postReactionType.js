const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
const postType = require('./postType');
const userType = require('./userType');
  
  const postReactionType = new GraphQLObjectType({
    name: 'PostReaction',
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
      isUpvote: {
        type: GraphQLBoolean,
      },
    }),
  });
  
  module.exports = postReactionType;