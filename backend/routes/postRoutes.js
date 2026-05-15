const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostBySlug, deletePost,updatePost } = require('../controllers/postController');

router.get('/', getPosts);   
router.post('/', createPost); 
router.get('/:slug', getPostBySlug);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);

module.exports = router;