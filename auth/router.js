const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  const userId = req.user._id;
  res.json({authToken, userId});
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
