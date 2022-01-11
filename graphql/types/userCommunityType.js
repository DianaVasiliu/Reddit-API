const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLBoolean,
  } = require('graphql');
const communityType = require('./communityType');
const userType = require('./userType');
  
const userCommunityType = new GraphQLObjectType({
    name: 'UserCommunity',
    fields: () => ({
        user: {
            type: userType,
            resolve: (source) => {
                return source.getUser();
            },
        },
        community: {
            type: communityType,
            resolve: (source) => {
                return source.getCommunity();
            },
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