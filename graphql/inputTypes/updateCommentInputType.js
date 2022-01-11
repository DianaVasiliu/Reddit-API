const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const updateCommentInputType = new GraphQLInputObjectType({
    name: 'UpdateCommentInputType',
    fields: {
        commentId: {
            type: new GraphQLNonNull(GraphQLID),
        },
        body: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

module.exports = updateCommentInputType;