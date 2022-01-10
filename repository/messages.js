// Contains all the logic for the messages

const db = require('../models')
const { Op } = require("sequelize");

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
    const messageId = parseInt(req.params.id)

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

const createMessage = async (args, context) => {
    const {
        fromId,
        toId,
        text,
    } = args;
    const { user } = context;

    if (!user) {
        console.log(
            'Unauthenticated user cannot send message'
        )
        return null;
    }

    if (parseInt(fromId) !== user.toJSON().id) {
        console.log(
            'User cannot send a message from another id other than his own'
        )
        return null;
    }

    try {
        if (fromId === toId) {
            console.log(
                'Cannot send message to yourself'
            )
            return null;
        }

        const fromUser = await db.User.findByPk(fromId)
        const toUser = await db.User.findByPk(toId)

        if (!fromUser || !toUser) {
            throw new Error('Sender or recipient not found')
        }

        const newMessage = {
            //...req.body,
            text,
            userId: fromId,
            toId,
        }

        const createdMessage = await fromUser.createMessage(newMessage)

        return createdMessage;
    } catch (e) {
        console.error(e)
        return {
            error: 'Something went wrong',
        }
    }
}

const deleteMessage = async (args, context) => {
    const { messageId } = args
    const body = {
        text: '<< This message was deleted >>',
    }
    const { user } = context

    if (!user) {
        console.log(
            'Unauthenticated user cannot delete messages'
        )
        return null
    }

    try {
        const message = await db.Message.findByPk(messageId)

        if (!message) {
            throw new Error('Message not found')
        }

        if (message.toJSON().userId !== user.id) {
            throw new Error('User cannot delete a message other than his own')
        }

        await db.Message.update(body, {
            where: {
                id: messageId,
            },
        })

        return message
    } catch (e) {
        console.error(e)
        return {
            error: 'Something went wrong',
        }
    }
}

const getUserMessages = async (args, context) => {
    const { userId } = args;
    const { user } = context;

    if (!user) {
        console.log(
            'Unauthenticated user cannot get messages'
        );
        return null;
    }

    const conversation = [ userId, user.id ];
    try {
        const userInDB = await db.User.findByPk(userId);

        if (!userInDB) {
            throw new Error('User not found');
        }

        if (userId === user.id) {
            throw new Error('User cannot get his own messages');
        }

        const messages = await db.Message.findAll({
            where: {
                userId: conversation,
                toId: conversation,
            },
        });

        return groupedMessages;
    } catch (e) {
        console.error(e);
        return {
            error: 'Something went wrong',
        };
    }
}

const getUserChats = async (context) => {
    const { user } = context;

    if (!user) {
        throw new Error('Cannot get messages of unauthenticated user');
    }

    try {
        const conversationsIds = await db.Message.findAll({
            where: {
                userId: fromId,
                [Op.or]: [{ userId: user.id }, { toId: userId }]
            },
        }).map((item) => item.toId === user.id ? item.userId : item.toId);

        const users = await db.User.findAll({
            id: conversationsIds
        });

        return users;
    } catch (e) {
        console.error(e)
        return {
            error: 'Something went wrong',
        }
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
