const express = require('express');
const Video = require('../models/Video');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, skip = 0 } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const videos = await Video.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .exec();

    const total = await Video.countDocuments(filter);

    res.json({
      success: true,
      total,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    req.body.instructor = req.user.id;

    const video = await Video.create(req.body);
    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this video' });
    }

    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this video' });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;