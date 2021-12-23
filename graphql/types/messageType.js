const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
  } = require('graphql');
  
  const messageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      userId: {
        type: GraphQLID,
      },
      toId: {
        type: GraphQLID,
      },
      text: {
        type: GraphQLString,
      },
    }),
  });
  
  module.exports = messageType;