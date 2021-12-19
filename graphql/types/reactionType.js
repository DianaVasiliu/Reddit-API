const {
    GraphQLObjectType,
    GraphQLBoolean,
  } = require('graphql');
  
  const reactionType = new GraphQLObjectType({
    name: 'Reaction',
    fields: () => {
      const postType = require('./postType');
  
      return {

        isUpvote: {
          type: GraphQLBoolean,
        },
        post: {
          type: postType,
          resolve: async (source) => {
            return source.post;
          }
        },
      }
    },
  });
  
  module.exports = reactionType;