const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
  } = require('graphql');
  
  const subscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    fields: () => {
      const communityType = require('./communityType');
      const userType = require('./userType');

      return {
        user: {
          type: userType,
          resolve: async (source, context) => {
            return source.updatedUser;
          }
        },
        subscriptions: {
          type: new GraphQLList(communityType),
          resolve: async (source, context) => {
            return source.subscriptions;
          }
        },
      }
    },
  });
  
  module.exports = subscriptionType;