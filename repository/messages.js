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
    const { toId, text } = args;
    const { user } = context;
    const fromId = user.id;

    if (!user) {
        throw new Error('Unauthenticated user cannot send message');
    }

    if (parseInt(fromId) !== user.toJSON().id) {
        throw new Error(
            'User cannot send a message from another id other than his own'
        );
    }

    try {
        if (fromId === toId) {
            throw new Error('Cannot send message to yourself');
        }

        const fromUser = await db.User.findByPk(fromId);
        const toUser = await db.User.findByPk(toId);

        if (!fromUser || !toUser) {
            throw new Error('Sender or recipient not found');
        }

        const newMessage = {
            //...req.body,
            text,
            userId: fromId,
            toId,
        };

        const createdMessage = await fromUser.createMessage(newMessage);

        return createdMessage;
    } catch (e) {
        console.error(e);
        throw new Error('Something went wrong');
    }
};

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

const getUserMessages = async (id, context) => {
    const { user } = context;

    if (!user) {
        console.log(
            'Unauthenticated user cannot get messages'
        );
        return null;
    }

    const conversation = [ id, user.id ];
    try {
        const userInDB = await db.User.findByPk(id);
        if (!userInDB) {
            throw new Error('User not found');
        }

        if (id === user.id) {
            throw new Error('User cannot get messages to himself');
        }

        const messages = await db.Message.findAll({
            where: {
                userId: conversation,
                toId: conversation,
            },
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        return messages;
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
        const messages = await db.Message.findAll({
            where: {
                [Op.or]: [{ userId: user.id }, { toId: user.id }]
            },
        });
        
        conversationsIds = messages.map((item) => item.toId === user.id ? item.userId : item.toId);
        console.log(conversationsIds);
        const users = await db.User.findAll({
            where: {
                id: conversationsIds
            }
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
    getUserChats,
}
