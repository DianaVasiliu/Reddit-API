const { 
    GraphQLObjectType, 
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
  } = require('graphql');
  const db = require('../models'); 
  
  const userType = require('./types/userType');
  const { getAllUsers, getUserById } = require('../repository/users');
  
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(userType),
        resolve: async () => {
          return await getAllUsers();
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          }
        },
        resolve: async (source, { id }, context) => {
          return getUserById(id);
        }
      },
    }
  });
  
  module.exports = queryType;