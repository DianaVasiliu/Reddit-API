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
    const userType = require('./userType');

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
        resolve: async (source, {
          ids
        }, context) => {
          let posts = await source.getPosts();

          if (ids) {
            posts = posts.filter(post => ids.map(id => parseInt(id)).includes(post.id));
          }

          return posts;
        }
      },
      members: {
        type: new GraphQLList(userType),
        resolve: async (source) => {
          const result = (await source.getUsers()).filter(item => item.UserCommunity.isModerator == false && item.UserCommunity.isAdmin == false);
          return result;
        }
      },
      moderators: {
        type: new GraphQLList(userType),
        resolve: async (source) => {
          const result = (await source.getUsers()).filter(item => item.UserCommunity.isModerator == true);
          return result;
        }
      },
      admins: {
        type: new GraphQLList(userType),
        resolve: async (source) => {
          const result = (await source.getUsers()).filter(item => item.UserCommunity.isAdmin == true);
          return result;
        }
      }
    }
  },
});

module.exports = communityType;