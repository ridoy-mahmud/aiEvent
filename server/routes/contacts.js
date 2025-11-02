const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/contacts
// @desc    Create a new contact message
// @access  Public (no authentication required)
router.post('/', async (req, res) => {
  console.log('📧 POST /api/contacts - Received request:', {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    messageLength: req.body.message?.length,
  });
  
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields (name, email, subject, message)',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact message sent successfully',
    });
  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send message. Please try again.',
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact messages (admin only)
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { read, limit = 50, page = 1 } = req.query;
    
    const query = {};
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Contact.countDocuments(query);
    const unreadCount = await Contact.countDocuments({ read: false });

    res.json({
      success: true,
      data: contacts,
      count: contacts.length,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get a single contact message (admin only)
// @access  Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    // Mark as read when viewed
    if (!contact.read) {
      contact.read = true;
      await contact.save();
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/contacts/:id/read
// @desc    Mark contact as read/unread (admin only)
// @access  Admin
router.put('/:id/read', protect, admin, async (req, res) => {
  try {
    const { read } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact message (admin only)
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

