const express = require('express');
const router = express.Router();
const status = require('../controllers/status_controllers')

router.post('/', status.createMessage)
router.get('/search', status.getMessagesBySearch);
router.get('/', status.getMessagesList);

module.exports = router;

