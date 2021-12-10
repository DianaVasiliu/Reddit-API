const express = require('express')
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
} = require('./controllers/users')
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('./controllers/posts')
const {
    getAllCommunityPosts,
    getCommunityPost,
    getAllCommunityMembers,
    getCommunityAdminsOrModerators,
    createCommunity,
    updateCommunity,
    deleteCommunity,
} = require('./controllers/communities')
const {
    getAllMessages,
    getMessageById,
    createMessage,
    deleteMessage,
    getUserMessages,
    getUserChat,
} = require('./controllers/messages')
const {
    getAllPostComments,
    postNewComment,
    getCommentThread,
} = require('./controllers/comments')

const port = 3001

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Home page')
})

app.get('/users', getAllUsers)
app.get('/users/:id', getUserById)
app.post('/users/', createUser)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

// TODO: update creating a post (must be posted in a community)
app.post('/users/:id/posts', createPost)

app.get('/posts', getAllPosts)
app.get('/posts/:id', getPostById)
app.put('/posts/:id', updatePost)
app.delete('/posts/:id', deletePost)

app.post('/users/:userId/communities/:communityId', updateSubscription)

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

app.get('/messages', getAllMessages)
app.get('/messages/:id', getMessageById)
app.post('/users/:fromId/messages/:toId', createMessage)
app.put('/messages/:id', deleteMessage)
app.get('/users/:userId/messages', getUserMessages)
app.get('/users/:fromId/messages/:toId', getUserChat)

app.get('/posts/:postId/comments', getAllPostComments)
// TODO: update posting a comment (get userId in auth token)
app.post('/posts/:postId/comments/post', postNewComment)
app.get('/posts/:postId/comments/:commentId', getCommentThread)

app.listen(port, () => {
    console.log('Server started on port', port)
})
