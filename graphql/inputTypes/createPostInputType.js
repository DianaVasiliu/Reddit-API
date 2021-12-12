const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    communityId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }
});

module.exports = createPostInputType;