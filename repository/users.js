// Contains all the logic for the graphql queries relating to users

const db = require('../models')

const getAllUsers = async () => {
    try {
        const allUsers = await db.User.findAll()
        return allUsers
    } catch (error) {
        console.error('Something went wrong');
        return null;
      } 
}

const getUserById = async (id) => {
    const userID = id

    try {
        const selectedUser = await db.User.findByPk(userID)
        return selectedUser 
    } catch (error) {
        console.error('Something went wrong');
        return null;
      } 
}

const createUser = async (args) => {
    const { email, username } = args

    try {
        const newUser = await db.User.create({
            email,
            username,
        })

        return newUser
    } catch (error) {
        console.error(error);
        return null;
      }
}

const updateUser = async (args, context) => {
    const { user } = context;
  
  if(!user) {
    return null;
  }

  const { id } = user;
  
  const { email, firstName, lastName } = args;

  try {
    await db.User.update({
      email,
      firstName,
      lastName,
    }, { where: { id } });

    return await db.User.findByPk(id);

  } catch (e) {
    console.error(e);
    return null;
  }
}

const deleteUser = async (id) => {
    const userID = id

    try {
        await db.User.destroy({
            where: {
                id: userID,
            },
        })
        return { result: "User deleted succesfully."}
    } catch (e) {
        console.error(e);
        return null;
      }
}

//TODO: decide on parameter names for userId and communityId and update queryType 
const subscribeToCommunity = async () => {
    // const userId = req.params.userId
    // const communityId = req.params.communityId
    // let error = 'Something went wrong'

    // try {
    //     const user = await db.User.findByPk(userId)
    //     const community = await db.Community.findByPk(communityId)

    //     if (!user || !community) {
    //         throw new Error('User or community not found')
    //     }

    //     await user.setCommunities(community)

    //     const updatedUser = await db.User.findByPk(userId)
    //     const tags = await updatedUser.getCommunities()

    //     const response = {
    //         ...updatedUser.toJSON(),
    //         tags,
    //     }

    //     res.status(201).send(response)
    // } catch (e) {
    //     console.error('Error:', e.message)
    //     res.send({
    //         error,
    //     })
    // }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    subscribeToCommunity,
}
