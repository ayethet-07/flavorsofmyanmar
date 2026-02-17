const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all recipes - coming soon' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create recipe - coming soon' });
});

module.exports = router;

