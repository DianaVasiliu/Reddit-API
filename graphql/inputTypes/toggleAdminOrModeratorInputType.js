const { GraphQLInputObjectType, GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");

const toggleAdminOrModeratorInputType = new GraphQLInputObjectType({
  name: 'toggleAdminOrModeratorInput',
  fields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    communityId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    option: {
        type: new GraphQLNonNull(GraphQLString),
    }
  }
});

module.exports = toggleAdminOrModeratorInputType;