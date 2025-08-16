
const express = require('express');
const router = express.Router();

router.route('/').get((req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

module.exports = router;