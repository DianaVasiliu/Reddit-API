const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const createCommunityInputType = new GraphQLInputObjectType({
  name: 'CreateCommunityInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }
});

module.exports = createCommunityInputType;