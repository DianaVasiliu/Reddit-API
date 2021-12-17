const {
  GraphQLObjectType
} = require('graphql');

const loginInputType = require('./inputTypes/loginInputType');
const createUserInputType = require('./inputTypes/createUserInputType');
const createPostInputType = require('./inputTypes/createPostInputType');
const createCommunityInputType = require('./inputTypes/createCommunityInputType')
const updateUserInputType = require('./inputTypes/updateUserInputType');
const updatePostInputType = require('./inputTypes/updatePostInputType');
const updateCommunityInputType = require('./inputTypes/updateCommunityInputType');
const updateSubscriptionInputType = require('./inputTypes/updateSubscriptionInputType');

const loginResultType = require('./types/loginResultType');
const userType = require('./types/userType');
const postType = require('./types/postType');
const communityType = require('./types/communityType');
const subscriptionType = require('./types/subscriptionType')

const loginHandler = require('../repository/login');
const {
  createUser,
  updateUser,
  updateSubscription,
} = require('../repository/users');
const {
  createPost,
  updatePost,
} = require('../repository/posts');
const {
  createCommunity, 
  updateCommunity,
} = require('../repository/communities');

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
      resolve: (_, {
        loginInput
      }) => {
        const {
          email,
          password
        } = loginInput;

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
      resolve: async (_, {
        createUserInput
      }) => {
        return createUser(createUserInput);
      }
    },
    updateUser: {
      type: userType,
      args: {
        updateUserInput: {
          type: updateUserInputType,
        },
      },
      resolve: async (_, {
        updateUserInput
      }, context) => {
        return updateUser(updateUserInput, context);
      }
    },
    updateSubscription: {
      type: subscriptionType,
      args: {
        updateSubscriptionInput: {
          type: updateSubscriptionInputType,
        },
      },
      resolve: async (_, {
        updateSubscriptionInput
      }, context) => {
        return updateSubscription(updateSubscriptionInput, context);
      }
    },
    createPost: {
      type: postType,
      args: {
        createPostInput: {
          type: createPostInputType
        },
      },
      resolve: async (_, {
        createPostInput
      }, context) => {
        return createPost(createPostInput, context);
      }
    },
    updatePost: {
      type: postType,
      args: {
        updatePostInput: {
          type: updatePostInputType
        },
      },
      resolve: async (_, {
        updatePostInput
      }, context) => {
        return updatePost(updatePostInput, context);
      }
    },
    createCommunity: {
      type: communityType,
      args: {
        createCommunityInput: {
          type: createCommunityInputType
        },
      },
      resolve: async (_, {
        createCommunityInput
      }, context) => {
        return createCommunity(createCommunityInput, context);
      }
    },
    updateCommunity: {
      type: communityType,
      args: {
        updateCommunityInput: {
          type: updateCommunityInputType
        }
      },
      resolve: async (_, {
        updateCommunityInput
      }, context) => {
        return updateCommunity(updateCommunityInput, context);
      }
    }
  },
})

module.exports = mutationType;