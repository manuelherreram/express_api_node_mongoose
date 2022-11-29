const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const posts = require('../controllers/posts.controller');

router.post('/posts', posts.create);
router.get('/posts', posts.list);
router.get('/posts/:id', posts.detail);
router.patch('/posts/:id', posts.update);
router.delete('/posts/:id', posts.delete);

module.exports = router;
