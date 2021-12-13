const express = require('express')
const { port } = require('./config/express')
const bodyParser = require('body-parser')
const app = express()
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateSubscription,
    toggleAdminOrModerator,
    getUserReactions,
    updateReaction,
} = require('./repository/users')
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getAllPostReactions,
} = require('./repository/posts')
const {
    getAllCommunityPosts,
    getCommunityPost,
    getAllCommunityMembers,
    getCommunityAdminsOrModerators,
    createCommunity,
    updateCommunity,
    deleteCommunity,
} = require('./repository/communities')
const {
    getAllMessages,
    getMessageById,
    createMessage,
    deleteMessage,
    getUserMessages,
    getUserChat,
} = require('./repository/messages')
const {
    getAllPostComments,
    postNewComment,
    getCommentThread,
    updateComment,
    deleteComment,
    getAllCommentReactions,
} = require('./repository/comments')

const { graphqlHTTP } = require('express-graphql')
const schema = require('./graphql')
const authorizationMiddleware = require('./middlewares/authorization')

app.use(bodyParser.json())

app.use(
    '/graphql',
    authorizationMiddleware,
    graphqlHTTP({
        schema,
    })
)

app.get('/', (req, res) => {
    res.send('Home page')
})

// USERS
app.get('/users', getAllUsers)
app.get('/users/:id', getUserById)
app.post('/users/', createUser)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)
app.get('/users/:id/reactions', getUserReactions)

// TODO: update creating a post (must be posted in a community)
app.post('/users/:id/posts', createPost)

// POSTS
app.get('/posts', getAllPosts)
app.get('/posts/:id', getPostById)
app.put('/posts/:id', updatePost)
app.delete('/posts/:id', deletePost)
app.get('/posts/:postId/reactions', getAllPostReactions)
app.put('/posts/:postId/reactions/update', (req, res) => {
    updateReaction('post', req, res)
})

app.post('/users/:userId/communities/:communityId', updateSubscription)

// COMMUNITIES
app.get('/communities/:communityId/posts', getAllCommunityPosts)
app.get('/communities/:communityId/posts/:postId', getCommunityPost)
app.get('/communities/:communityId/members', getAllCommunityMembers)
app.get('/communities/:communityId/admins', (req, res) => {
    getCommunityAdminsOrModerators('admins', req, res)
})
app.get('/communities/:communityId/moderators', (req, res) => {
    getCommunityAdminsOrModerators('moderators', req, res)
})
app.post('/communities/create/:userId', createCommunity)
app.put('/communities/:id/update', updateCommunity)
app.delete('/communities/:id/delete', deleteCommunity)
app.put('/communities/:communityId/admins/:userId/updateRole', (req, res) => {
    toggleAdminOrModerator('admin', req, res)
})
app.put(
    '/communities/:communityId/moderators/:userId/updateRole',
    (req, res) => {
        toggleAdminOrModerator('moderator', req, res)
    }
)

// MESSAGES
app.get('/messages', getAllMessages)
app.get('/messages/:id', getMessageById)
app.post('/users/:fromId/messages/:toId', createMessage)
app.put('/messages/:id', deleteMessage)
app.get('/users/:userId/messages', getUserMessages)
app.get('/users/:fromId/messages/:toId', getUserChat)

// COMMENTS
app.get('/posts/:postId/comments', getAllPostComments)
app.post('/posts/:postId/comments/post', postNewComment)
app.get('/posts/:postId/comments/:commentId', getCommentThread)
app.put('/posts/:postId/comments/:commentId', updateComment)
app.delete('/posts/:postId/comments/:commentId', deleteComment)
app.put('/posts/:postId/comments/:commentId/reactions/update', (req, res) => {
    updateReaction('comment', req, res)
})
app.get('/posts/:postId/comments/:commentId/reactions', getAllCommentReactions)

app.listen(port, () => {
    console.log('Server started on port', port)
})
