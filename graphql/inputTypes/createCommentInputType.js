const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const createCommentInputType = new GraphQLInputObjectType({
    name: 'CreateCommentInputType',
    fields: {
        postId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        replyToCommentId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        body: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

module.exports = createCommunityInputType;