const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");

const updateCommentInputType = new GraphQLInputObjectType({
    name: 'UpdateCommentInputType',
    fields: {
        body: {
            type: GraphQLString,
        },
    },
});

module.exports = updateCommentInputType;