
const AIService = require('../services/aiService');
const Note = require('../models/Note');

// @desc    Analyze a specific note
// @route   POST /api/ai/analyze/note/:id
// @access  Private
exports.analyzeNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note
    const note = await Note.findOne({
      _id: id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (!note.content || note.content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Note content is too short for AI analysis (minimum 10 characters required)'
      });
    }

    console.log(`Starting AI analysis for note: ${note.title}`);
    
    // Perform AI analysis with new service
    const aiAnalysis = await AIService.analyzeNote(note.content);

    // Fix the update operation - no conflict
    const updateData = {
      aiAnalysis: {
        ...aiAnalysis,
        lastAnalyzed: new Date()
      }
    };

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: aiAnalysis.status === 'success' ? 
        'AI analysis completed successfully!' : 
        'AI analysis completed with fallback (service unavailable)',
      data: {
        note: updatedNote,
        analysis: aiAnalysis
      }
    });

  } catch (error) {
    console.error('Note analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI analysis failed. Please try again later.'
    });
  }
};

// @desc    Analyze raw text
// @route   POST /api/ai/analyze/text
// @access  Private
exports.analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Text is too short for AI analysis (minimum 10 characters required)'
      });
    }

    console.log('Starting AI analysis for raw text...');
    
    // Perform AI analysis with new service
    const analysis = await AIService.analyzeNote(text);

    res.json({
      success: true,
      message: analysis.status === 'success' ? 
        'Text analysis completed successfully!' : 
        'Text analysis completed with fallback (service unavailable)',
      data: {
        analysis
      }
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Text analysis failed. Please try again later.'
    });
  }
};

// @desc    Get AI service status
// @route   GET /api/ai/status
// @access  Private
exports.getAIStatus = async (req, res) => {
  try {
    console.log('Checking AI service status with new router API...');
    
    const testResult = await AIService.testConnection();
    
    if (testResult.success) {
      console.log('AI service is operational');
      res.json({
        success: true,
        data: {
          status: 'operational',
          service: 'Hugging Face Router API',
          lastChecked: new Date(),
          capabilities: [
            'text_summarization',
            'keyword_extraction', 
            'tone_analysis',
            'question_generation',
            'text_simplification'
          ],
          message: 'AI service is ready for analysis'
        }
      });
    } else {
      console.log(' AI service is unavailable:', testResult.error);
      res.json({
        success: true,
        data: {
          status: 'unavailable',
          service: 'Hugging Face Router API',
          lastChecked: new Date(),
          error: testResult.error,
          suggestion: testResult.suggestion,
          capabilities: [],
          message: 'AI service is currently unavailable'
        }
      });
    }
  } catch (error) {
    console.error('AI status check failed:', error);
    res.json({
      success: true,
      data: {
        status: 'unavailable',
        service: 'Hugging Face Router API',
        lastChecked: new Date(),
        error: error.message,
        capabilities: [],
        message: 'Failed to check AI service status'
      }
    });
  }
};

// @desc    Test AI connection
// @route   GET /api/ai/test
// @access  Private
exports.testAIConnection = async (req, res) => {
  try {
    console.log(' Testing AI connection...');
    
    // Test with a simple request using new service
    const testText = "Hello, this is a test to check if the AI service is working properly.";
    const testAnalysis = await AIService.analyzeNote(testText);

    res.json({
      success: true,
      message: 'AI service test completed',
      data: {
        status: testAnalysis.status === 'success' ? 'operational' : 'degraded',
        testAnalysis,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI connection test failed:', error);
    res.status(500).json({
      success: false,
      error: `AI service test failed: ${error.message}`,
      details: {
        hasToken: !!process.env.HUGGING_FACE_TOKEN,
        tokenPreview: process.env.HUGGING_FACE_TOKEN ? 
          `${process.env.HUGGING_FACE_TOKEN.substring(0, 10)}...` : 'No token'
      }
    }); 
  }
};