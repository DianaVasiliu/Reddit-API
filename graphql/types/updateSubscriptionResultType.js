const {
    GraphQLObjectType,
    GraphQLList,
  } = require('graphql');
  
  const updateSubscriptionsResultType = new GraphQLObjectType({
    name: 'UpdateSubscriptionResult',
    fields: () => {
      const communityType = require('./communityType');
      const userType = require('./userType');

      return {
        user: {
          type: userType,
          resolve: async (source) => {
            return source.user;
          }
        },
        subscriptions: {
          type: new GraphQLList(communityType),
          resolve: async (source) => {
            return source.subscriptions;
          }
        },
      }
    },
  });
  
  module.exports = updateSubscriptionsResultType;