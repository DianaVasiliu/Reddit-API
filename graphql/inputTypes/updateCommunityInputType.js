const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull
} = require("graphql");

const updateCommunityInputType = new GraphQLInputObjectType({
    name: 'UpdateCommunityInput',
    fields: {
        communityId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        }
    }
});

module.exports = updateCommunityInputType;