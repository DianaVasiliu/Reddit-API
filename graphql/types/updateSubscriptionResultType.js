const {
    GraphQLObjectType,
    GraphQLList,
  } = require('graphql');
  
  const updateSubscriptionsResultType = new GraphQLObjectType({
    name: 'UpdateSubscriptionsResult',
    fields: () => {
      const communityType = require('./communityType');
      const userType = require('./userType');

      return {
        user: {
          type: userType,
          resolve: async (source) => {
            return source.updatedUser;
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