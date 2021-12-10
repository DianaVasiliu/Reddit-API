const {
  GraphQLObjectType
} = require('graphql');
const loginHandler = require('../repository/login');
const createUserInputType = require('./inputTypes/createUserInputType');
const createPostInputType = require('./inputTypes/createPostInputType');
const loginInputType = require('./inputTypes/loginInputType');
const updateUserInputType = require('./inputTypes/updateUserInputType');

const loginResultType = require('./types/loginResultType');
const userType = require('./types/userType');
const postType = require('./types/postType');
const {
  createUser,
  updateUser
} = require('../repository/users');
const {
  createPost, updatePost,
} = require('../repository/posts');
const updatePostInputType = require('./inputTypes/updatePostInputType');

// TODO: test login / register flow
const mutationType = new GraphQLObjectType({ 
  name: 'Mutation',
  fields: {
    login: {
      type: loginResultType,
      args: {
        loginInput: {
          type: loginInputType,
        }
      },
      resolve: (_, args) => {
        const {
          email,
          password
        } = args.loginInput;

        const token = loginHandler(email, password);

        return {
          token,
        };
      }
    },
    createUser: {
      type: userType,
      args: {
        createUserInput: {
          type: createUserInputType,
        }
      },
      resolve: async (_, args) => {
        return createUser(args.createUserInput);
      }
    },
    updateUser: {
      type: userType,
      args: {
        updateUserInput: {
          type: updateUserInputType,
        },
      },
      resolve: async (_, args, context) => {
        return updateUser(args.updateUserInput, context);
      }
    },
    createPost: {
      type: postType,
      args: {
        createPostInput: {
          type: createPostInputType
        },
      },
      resolve: async (_, args, context) => {
        return createPost(args.createPostInput, context);
      }
    },
    updatePost: {
      type: postType,
      args: {
        updatePostInput: {
          type: updatePostInputType
        },
      },
      resolve: async (_, args, context) => {
        return updatePost(args.updatePostInput, context);
      }
    }
  },
})

module.exports = mutationType;