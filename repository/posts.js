const db = require('../models')

const getAllPosts = async () => {
    try {
        const allPosts = await db.Post.findAll();
        return allPosts;
    } catch (error) {
        console.error('Something went wrong');
        return null;
    }
}

const getPostById = async (id) => {
    const postId = id;

    try {
        const selectedPost = await db.Post.findByPk(postId);
        return selectedPost;
    } catch (error) {
        console.error('Something went wrong');
        return null;
    }
}

const createPost = async (args, context) => {
    const {
        title,
        body
    } = args;
    const {
        user
    } = context;

    if (!user) {
        console.log("Tried to create a post without being logged in. (without having a token in Authorization header)\n");
        return null;
    }

    try {
        const newPost = await db.Post.create({
            title,
            body,
            'author': user
        });

        return newPost;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const updatePost = async (args, context) => {
    const {
        id,
        title,
        body
    } = args;
    const selectedPost = await db.Post.findByPk(id);
    const {
        user
    } = context;

    if (!user) {
        console.log("Tried to update a post without being logged in. (without having a token in Authorization header)\n");
        return null;
    }

    if (selectedPost.userId != user.id) {
        console.log('Tried to update a post without being the author\n');
        return null;
    }

    try {
        await db.Post.update({
            title,
            body,
        }, {
            where: {
                id
            }
        });

        return await db.Post.findByPk(id);

    } catch (e) {
        console.error(e);
        return null;
    }
}

const deletePost = async (args, context) => {
    const {
        id
    } = args;

    const {
        user
    } = context;
    const selectedPost = await db.Post.findByPk(id);

    if (!user) {
        console.log("Tried to delete a post without being logged in. (without having a token in Authorization header)\n");
        return null;
    }

    if (selectedPost.userId != user.id) {
        console.log('Tried to delete a post without being the author\n');
        return null;
    }

    try {
        await db.Post.destroy({
            where: {
                id,
            },
        });
        return {
            result: "Post deleted succesfully."
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
}