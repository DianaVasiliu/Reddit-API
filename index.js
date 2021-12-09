const express = require('express')
const { port } = require('./config/express');
const bodyParser = require('body-parser')
const app = express()
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    subscribeToCommunity,
} = require('./controllers/users')
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('./controllers/posts')

const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql');
const authorizationMiddleware = require('./middlewares/authorization');

app.use(bodyParser.json())

app.use('/graphql', authorizationMiddleware, graphqlHTTP({
    schema,
}));

app.get('/', (req, res) => {
    res.send('Home page')
})

app.get('/users', getAllUsers)
app.get('/users/:id', getUserById)
app.post('/users/', createUser)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

app.post('/users/:id/posts', createPost)

app.get('/posts', getAllPosts)
app.get('/posts/:id', getPostById)
app.put('/posts/:id', updatePost)
app.delete('/posts/:id', deletePost)

app.post('/users/:userId/communities/:communityId', subscribeToCommunity)

app.listen(port, () => {
    console.log('Server started on port', port)
})
