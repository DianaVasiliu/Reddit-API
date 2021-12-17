const { GraphQLInputObjectType, GraphQLID, GraphQLNonNull } = require("graphql");

const updateSubscriptionInputType = new GraphQLInputObjectType({
  name: 'UpdateSubscriptionInput',
  fields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    communityId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }
});

module.exports = updateSubscriptionInputType;