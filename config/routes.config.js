const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts.controller');
const users = require('../controllers/users.controller');
const sec = require("../middlewares/secure.middleware.js");

//POSTS CRUD
router.post('/posts', sec.auth, posts.create);
router.get('/posts', sec.auth, posts.list);
router.get('/posts/:id', sec.auth, posts.detail);
router.patch('/posts/:id', sec.auth, posts.update);
router.delete('/posts/:id', sec.auth, posts.delete);

//user
router.post('/users', users.create);
router.post('/login', users.login);
router.get("/account/validate/:token", users.validate);

module.exports = router;