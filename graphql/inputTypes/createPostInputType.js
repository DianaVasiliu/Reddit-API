const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }
});

module.exports = createPostInputType;