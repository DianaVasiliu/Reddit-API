const jwt = require('jsonwebtoken');
const { MY_SECRET_KEY } = require('../config/jwt');
const db = require('../models');

//TODO: handle the next() calls on the two else branches (limit access instead)
const authorizationMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if(authorization) {
    try {
      const decoded = jwt.verify(authorization.replace('Bearer ', ''), MY_SECRET_KEY);
      const userId = decoded.id;

      const user = await db.User.findByPk(userId);
      if(user) { //if user has a valid jwt
        req.user = user;
        next();
      }
      else { //if user has an invalid jwt
        next();
      }
    } catch (e) { 
      console.error('error', e)
      next();
    }
  } else { //if user has no authorization header
    next();
  }

  
}

module.exports = authorizationMiddleware;