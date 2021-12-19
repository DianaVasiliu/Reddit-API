const {
    GraphQLObjectType,
    GraphQLBoolean
  } = require('graphql');
  
  const updateReactionResultType = new GraphQLObjectType({
    name: 'UpdateReactionResult',
    fields: () => {
      const commentType = require('./commentType');
      const commentReactionType = require('./commentReactionType');
      const userType = require('./userType');
      const postType = require('./postType');
      const postReactionType = require('./postReactionType');

      return {
        isUpvote: {
            type: GraphQLBoolean,
        },
        user: {
            type: userType,
            resolve: async (source) => {
              return source.user;
            }
        },
        comment: {
            type: commentType,
            resolve: async (source) => {
                if (!source.comment) {
                    return null;
                }
                return source.comment;
              }
        },
        commentReaction: {
            type: commentReactionType,
            resolve: async (source) => {
                if (!source.commentReaction) {
                    return null;
                }
                return source.commentReaction;
              }
        },  
        post: {
            type: postType,
            resolve: async (source) => {
                return source.post;
            }
        },
        postReaction: {
            type: postReactionType,
            resolve: async (source) => {
                if (!source.postReaction) {
                    return null;
                }
                return source.postReaction;
            }
        },
      }
    },
  });
  
  module.exports = updateReactionResultType;