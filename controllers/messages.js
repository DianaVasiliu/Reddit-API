// Contains all the logic for the messages

const db = require('../models')

const getAllMessages = async (req, res) => {
    try {
        const allMessages = await db.Message.findAll()
        res.status(200).send(allMessages)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getMessageById = async (req, res) => {
    const messageId = req.params.id

    try {
        const selectedMessage = await db.Message.findByPk(messageId)
        const fromUser = await selectedMessage.getUser()

        const toId = parseInt(selectedMessage.toJSON().toId)
        const toUser = await db.User.findByPk(toId)

        const response = {
            ...selectedMessage.toJSON(),
            fromUser,
            toUser,
        }

        if (selectedMessage === null) {
            res.status(404).send('Message not found')
        } else {
            res.status(302).send(response)
        }
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const createMessage = async (req, res) => {
    const fromId = parseInt(req.params.fromId)
    const toId = parseInt(req.params.toId)

    try {
        if (fromId === toId) {
            throw new Error('Cannot send message to yourself')
        }

        const fromUser = await db.User.findByPk(fromId)
        const toUser = await db.User.findByPk(toId)

        if (!fromUser || !toUser) {
            throw new Error('Sender or recipient not found')
        }

        const newMessage = {
            ...req.body,
            userId: fromId,
            toId,
        }

        const createdMessage = await fromUser.createMessage(newMessage)

        res.status(201).send(createdMessage)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const deleteMessage = async (req, res) => {
    const messageId = req.params.id
    const body = {
        text: '<< This message was deleted >>',
    }

    try {
        const message = await db.Message.findByPk(messageId)

        if (!message) {
            throw new Error('Message not found')
        }

        await db.Message.update(body, {
            where: {
                id: messageId,
            },
        })

        res.status(202).send('Message deleted successfully')
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getUserMessages = async (req, res) => {
    const userId = req.params.userId

    try {
        const user = await db.User.findByPk(userId)

        if (!user) {
            throw new Error('User not found')
        }

        const messages = await db.Message.findAll({
            where: {
                userId,
            },
        })

        var jsonMessages = messages.map((message) => message.toJSON())
        jsonMessages.sort((a, b) => {
            return a.createdAt - b.createdAt
        })

        const groupedMessages = {}

        jsonMessages.forEach((message) => {
            const id = parseInt(message.toId)

            if (id in groupedMessages) {
                groupedMessages[id]['messages'].push(message)
            } else {
                groupedMessages[id] = {
                    messages: [message],
                }
            }
        })

        res.send(groupedMessages)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

const getUserChat = async (req, res) => {
    const fromId = parseInt(req.params.fromId)
    const toId = parseInt(req.params.toId)

    try {
        if (fromId === toId) {
            throw new Error('Cannot have self chat')
        }

        const fromUser = await db.User.findByPk(fromId)
        const toUser = await db.User.findByPk(toId)

        if (!fromUser || !toUser) {
            throw new Error('Sender or recipient not found')
        }

        const messages = await db.Message.findAll({
            where: {
                userId: fromId,
                toId,
            },
        })

        var jsonMessages = messages.map((message) => message.toJSON())
        jsonMessages.sort((a, b) => {
            return a.createdAt - b.createdAt
        })

        res.status(201).send(jsonMessages)
    } catch (e) {
        console.error(e)
        res.send({
            error: 'Something went wrong',
        })
    }
}

module.exports = {
    getAllMessages,
    getMessageById,
    createMessage,
    deleteMessage,
    getUserMessages,
    getUserChat,
}
