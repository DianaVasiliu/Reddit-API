const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

const userType = require('./types/userType');
const postType = require('./types/postType');
const communityType = require('./types/communityType');

const {
  getAllUsers,
  getUserById
} = require('../repository/users');
const {
  getAllPosts,
  getPostById
} = require('../repository/posts');
const {
  getAllCommunities, getCommunity
} = require('../repository/communities');


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(userType),
      resolve: async () => {
        return await getAllUsers();
      }
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      resolve: async (source, {
        id
      }, context) => {
        return getUserById(id);
      }
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async () => {
        return await getAllPosts();
      }
    },
    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      resolve: async (source, {
        id
      }, context) => {
        return getPostById(id);
      }
    },
    communities: {
      type: new GraphQLList(communityType),
      resolve: async () => {
        return await getAllCommunities();
      }
    },
    community: {
      type: communityType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        }
      },
      resolve: async (source, {
        id
      }, context) => {
        return await getCommunity(id);
      }
    },
  }
});

module.exports = queryType;