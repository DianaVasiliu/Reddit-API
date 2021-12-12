const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} = require('graphql');



const communityType = new GraphQLObjectType({
  name: 'Community',
  fields: () => {
    const postType = require('./postType');

    return {
      id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      posts: {
        type: new GraphQLList(postType),
        args: {
          ids: {
            type: new GraphQLList(GraphQLID)
          }
        },
        resolve: async (source, { ids }, context) => {
          let posts = await source.getPosts();

          if (ids) {
            ids = ids.map(id => parseInt(id));
            posts = posts.filter(post => ids.includes(post.id));
          }

          return posts;
        }
      }
    }
  },
});

module.exports = communityType;