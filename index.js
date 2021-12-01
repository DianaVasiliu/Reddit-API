const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('./controllers/users')

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

app.listen(port, () => {
    console.log('Server started on port', port)
})
