const { 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID,
  } = require('graphql');
  
  const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
      id: {
        type: GraphQLID,
      },
      email: { 
        type: GraphQLString,
      },
      username: { 
        type: GraphQLString 
      },
    }
  });
  
  module.exports = userType;