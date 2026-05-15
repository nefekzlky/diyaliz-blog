const express = require('express');
const router = express.Router();
const { getAboutText, updateAboutText } = require('../controllers/settingController');

router.get('/about', getAboutText);
router.put('/about', updateAboutText);

module.exports = router;