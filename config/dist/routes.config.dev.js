"use strict";

var express = require('express');

var router = express.Router();

var upload = require('../config/multer.config');

var users = require('../controllers/users.controller');

var posts = require('../controllers/posts.controller');

var sec = require('../middlewares/secure.middleware');

router.post('/users', upload.single('avatar'), users.create);
router.get('/users/:id', sec.auth, users.get);
router.patch('/users/:id', sec.auth, sec.self, upload.single('avatar'), users.update);
router["delete"]('/users/:id', sec.auth, sec.self, users["delete"]);
router.post('/login', users.login);
router.post('/logout', sec.auth, users.logout);
router.get('/authenticate/google', users.loginWithGoogle);
router.get('/authenticate/google/cb', users.doLoginWithGoogle);
router.post('/posts', sec.auth, posts.create);
router.get('/posts', sec.auth, posts.list);
router.get('/posts/:id', sec.auth, sec.postOwner, posts.detail);
router.patch('/post/id:', sec.auth, sec.postOwner, posts.update);
router["delete"]('/posts/:id', sec.auth, sec.postOwner, posts["delete"]);
module.exports = router;