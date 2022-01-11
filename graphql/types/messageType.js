const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
  } = require('graphql');
const db = require('../../models');
const userType = require('./userType');
  
  const messageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      author: {
        type: userType,
        resolve: async (source) => {
          return await db.User.findByPk(source.userId);
        }
      },
      receiver: {
        type: userType,
        resolve: async (source) => {
          return await db.User.findByPk(source.toId);
        }
      },
      text: {
        type: GraphQLString,
      },
    }),
  });
  
  module.exports = messageType;