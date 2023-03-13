const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const auth = async (req, res, next) => {
  //   console.log(`Auth middleware`);

  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(`TOKEN: ${token}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`DECODED: ${decoded._id}`);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    // console.log(`USER: ${user}`);

    if (!user) {
      throw new Error(`No user found!`);
    }

    req.token = token;
    req.user = user;
    next();
    return req.token, req.user;
  } catch (error) {
    res.status(401).send({ error: 'Please Authanticate!' });
  }

  next();
};

module.exports = auth;
