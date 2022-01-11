const { GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLString } = require("graphql");

const createMessageInputType = new GraphQLInputObjectType({
  name: 'CreateMessageInput',
  fields: {
    toId: {
        type: new GraphQLNonNull(GraphQLID),
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }
});

module.exports = createMessageInputType;