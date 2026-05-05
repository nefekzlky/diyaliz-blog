const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostBySlug } = require('../controllers/postController');

router.get('/', getPosts);   
router.post('/', createPost); 
router.get('/:slug', getPostBySlug);

module.exports = router;