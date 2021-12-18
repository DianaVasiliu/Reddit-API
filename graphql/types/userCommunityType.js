const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
  
  const userCommunityType = new GraphQLObjectType({
    name: 'UserCommunity',
    fields: () => ({
      id: {
        type: GraphQLID,
      },
      userId: {
        type: GraphQLID,
      },
      communityId: {
        type: GraphQLID,
      },
      isAdmin: {
        type: GraphQLBoolean,
      },
      isModerator: {
        type: GraphQLBoolean,
      },
    }),
  });
  
  module.exports = userCommunityType;