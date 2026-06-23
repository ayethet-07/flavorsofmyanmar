const express = require('express');
const Ingredient = require('../models/Ingredient');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, limit = 50, skip = 0 } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const ingredients = await Ingredient.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ name: 1 })
      .exec();

    const total = await Ingredient.countDocuments(filter);

    res.json({
      success: true,
      total,
      count: ingredients.length,
      ingredients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ success: true, ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json({ success: true, ingredient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ success: true, ingredient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ success: true, message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;