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

app.listen(port, () => {
    console.log('Server started on port', port)
})
