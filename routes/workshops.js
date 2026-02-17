const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all workshops - coming soon' });
});

module.exports = router;

