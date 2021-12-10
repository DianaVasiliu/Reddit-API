const { GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = require("graphql");

const updatePostInputType = new GraphQLInputObjectType({
  name: 'UpdatePostInput',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    }
  }
});

module.exports = updatePostInputType;