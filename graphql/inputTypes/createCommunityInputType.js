const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const createCommunityInputType = new GraphQLInputObjectType({
  name: 'CreateCommunityInput',
  fields: {
    communityId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }
});

module.exports = createCommunityInputType;