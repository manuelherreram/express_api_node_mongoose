const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const session = expressSession({
  secret: process.env.SESSION_SECRET || 'M4NuH9!',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: process.env.SESSION_MAX_AGE || 3600000,
  },
});

module.exports = session;
