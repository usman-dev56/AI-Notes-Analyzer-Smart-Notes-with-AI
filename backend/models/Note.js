const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['Study', 'Work', 'Personal'],
      message: 'Category must be Study, Work, or Personal'
    },
    default: 'Study'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  aiAnalysis: {
    summary: String,
    keywords: [String],
    questions: [String],
    simplifiedContent: String,
    tone: {
      type: String,
      enum: ['formal', 'academic', 'casual', 'technical']
    },
    lastAnalyzed: Date,
    modelUsed: String
  }
}, {
  timestamps: true
});

// Text search index for better search performance
noteSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text'
});

// Index for user and category filtering
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ user: 1, isPinned: -1 });
noteSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);