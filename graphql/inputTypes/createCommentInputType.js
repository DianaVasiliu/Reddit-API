const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const createCommentInputType = new GraphQLInputObjectType({
    name: 'CreateCommentInputType',
    fields: {
        postId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        replyToCommentId: {
            type: GraphQLID,
        },
        body: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

module.exports = createCommentInputType;