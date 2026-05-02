const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');

router.get('/', getPosts);   
router.post('/', createPost); 

module.exports = router;