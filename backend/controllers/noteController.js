const Note = require('../models/Note');

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      pinned,
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { user: req.user.id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (pinned === 'true') {
      query.isPinned = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const notes = await Note.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      data: {
        notes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalNotes: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes'
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: {
        note
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note'
    });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags, isPinned } = req.body;

    const note = await Note.create({
      title,
      content,
      category: category || 'Study',
      tags: tags || [],
      isPinned: isPinned || false,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        note
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create note'
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: {
        note
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update note'
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete note'
    });
  }
};

// @desc    Toggle pin status
// @route   PATCH /api/notes/:id/pin
// @access  Private
exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: {
        note
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to toggle pin status'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/notes/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ user: req.user.id });
    
    const categoryStats = await Note.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const analyzedNotes = await Note.countDocuments({
      user: req.user.id,
      'aiAnalysis.lastAnalyzed': { $exists: true }
    });

    // Recent notes (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentNotes = await Note.countDocuments({
      user: req.user.id,
      updatedAt: { $gte: oneWeekAgo }
    });

    // Common tone
    const toneStats = await Note.aggregate([
      { $match: { user: req.user._id, 'aiAnalysis.tone': { $exists: true } } },
      { $group: { _id: '$aiAnalysis.tone', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Top keywords
    const keywordStats = await Note.aggregate([
      { $match: { user: req.user._id, 'aiAnalysis.keywords': { $exists: true } } },
      { $unwind: '$aiAnalysis.keywords' },
      { $group: { _id: '$aiAnalysis.keywords', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const categoryCount = {};
    categoryStats.forEach(stat => {
      categoryCount[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalNotes,
        categoryCount,
        analyzedNotes,
        recentNotes,
        commonTone: toneStats[0]?._id || 'N/A',
        topKeywords: keywordStats.map(k => k._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
};