const axios = require('axios');

class AIService {
  constructor() {
    this.apiToken = process.env.HUGGING_FACE_TOKEN;
    this.baseURL = 'https://router.huggingface.co'; // NEW API ENDPOINT
    this.chatURL = 'https://api-inference.huggingface.co/models'; // For chat models
    
    console.log('🔧 AI Service initialized with new router API');
    console.log('📡 Using endpoint:', this.baseURL);
    
    if (!this.apiToken) {
      console.error('❌ HUGGING_FACE_TOKEN is missing from environment variables!');
    }
  }

  async queryModel(model, inputs, options = {}) {
    try {
      console.log(` Querying ${model} via router API...`);
      
      const response = await axios.post(
        `${this.baseURL}/${model}`,
        { inputs, parameters: options.parameters || {} },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 45000 // 45 seconds for model loading
        }
      );

      // Handle model loading with new API format
      if (response.data.error && response.data.error.includes('loading')) {
        const estimatedTime = response.data.estimated_time || 45;
        console.log(`Model loading, waiting ${estimatedTime}s...`);
        await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
        return this.queryModel(model, inputs, options); // Retry
      }

      console.log(`${model} responded successfully`);
      return response.data;

    } catch (error) {
      console.error(` ${model} query failed:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data
      });

      // Handle specific errors
      if (error.response?.status === 503) {
        throw new Error('AI model is currently loading. Please try again in 30-60 seconds.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid Hugging Face token. Please check your API token.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('AI service timeout. Please try again.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  async queryChatModel(model, messages) {
    try {
      console.log(` Querying chat model: ${model}`);
      
      const response = await axios.post(
        `${this.chatURL}/${model}`,
        { inputs: messages },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;

    } catch (error) {
      console.error(`Chat model ${model} failed:`, error.message);
      throw error;
    }
  }

  async generateSummary(text) {
    try {
      // Use a reliable model for summarization
      const result = await this.queryModel("facebook/bart-large-cnn", text, {
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false
        }
      });
      
      return result[0]?.summary_text || this.getFallbackSummary(text);
    } catch (error) {
      console.error('Summary generation failed:', error.message);
      return this.getFallbackSummary(text);
    }
  }

  async extractKeywords(text) {
    try {
      // Use a chat model for better keyword extraction
      const prompt = `Extract 5-7 most important keywords from this text. Return only a comma-separated list of keywords: "${text.substring(0, 800)}"`;
      
      const result = await this.queryModel("microsoft/DialoGPT-medium", prompt, {
        parameters: {
          max_length: 100,
          temperature: 0.3
        }
      });
      
      let keywordsText = result.generated_text || "";
      
      // Clean and extract keywords
      const keywords = keywordsText
        .split(',')
        .map(k => k.trim().replace(/[^a-zA-Z0-9\s]/g, ''))
        .filter(k => k.length > 2 && k.length < 25)
        .slice(0, 7);
      
      return keywords.length > 0 ? keywords : this.getFallbackKeywords(text);
    } catch (error) {
      console.error('Keyword extraction failed:', error.message);
      return this.getFallbackKeywords(text);
    }
  }

  async detectTone(text) {
    try {
      // Use a reliable sentiment analysis model
      const result = await this.queryModel(
        "cardiffnlp/twitter-roberta-base-sentiment-latest", 
        text.substring(0, 512)
      );
      
      if (result && result[0]) {
        const topLabel = result[0].reduce((prev, current) => 
          (prev.score > current.score) ? prev : current
        ).label;
        
        const toneMap = { 
          'positive': 'casual', 
          'negative': 'formal', 
          'neutral': 'academic' 
        };
        return toneMap[topLabel] || 'academic';
      }
      return 'academic';
    } catch (error) {
      console.error('Tone detection failed:', error.message);
      return this.analyzeToneFallback(text);
    }
  }

  async generateQuestions(text) {
    try {
      const prompt = `Generate 3 study questions about this text: "${text.substring(0, 800)}"`;
      
      const result = await this.queryModel("microsoft/DialoGPT-medium", prompt, {
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      });
      
      const questionsText = result.generated_text || "";
      const questions = questionsText.split('\n')
        .filter(line => line.trim().match(/^\d+\.|^-|^Q:/))
        .map(q => q.replace(/^\d+\.\s*|^-\s*|^Q:\s*/, '').trim())
        .filter(q => q.length > 10 && !q.includes('?')) // Filter out questions that are too short
        .map(q => q + '?') // Add question mark
        .slice(0, 3);
      
      return questions.length > 0 ? questions : this.getFallbackQuestions();
    } catch (error) {
      console.error('Question generation failed:', error.message);
      return this.getFallbackQuestions();
    }
  }

  async simplifyText(text) {
    try {
      const prompt = `Rewrite this text in simpler language: "${text.substring(0, 800)}"`;
      
      const result = await this.queryModel("microsoft/DialoGPT-medium", prompt, {
        parameters: {
          max_length: 400,
          temperature: 0.5
        }
      });
      
      return result.generated_text || this.getFallbackSimplified(text);
    } catch (error) {
      console.error('Text simplification failed:', error.message);
      return this.getFallbackSimplified(text);
    }
  }

  async analyzeNote(content) {
    try {
      console.log(' Starting AI analysis with new API...');
      
      if (!this.apiToken) {
        throw new Error('Hugging Face token not configured.');
      }

      if (!content || content.trim().length < 10) {
        throw new Error('Content too short for analysis');
      }

      console.log(' Analyzing content length:', content.length);

      // Run analyses sequentially to avoid overwhelming the API
      console.log('Generating summary...');
      const summary = await this.generateSummary(content);
      
      console.log(' Extracting keywords...');
      const keywords = await this.extractKeywords(content);
      
      console.log('Detecting tone...');
      const tone = await this.detectTone(content);
      
      console.log('Generating questions...');
      const questions = await this.generateQuestions(content);
      
      console.log('Simplifying text...');
      const simplifiedContent = await this.simplifyText(content);

      console.log('AI analysis completed successfully!');
      
      return {
        summary,
        keywords,
        tone,
        questions,
        simplifiedContent,
        lastAnalyzed: new Date(),
        modelUsed: 'Hugging Face Router API',
        status: 'success'
      };
      
    } catch (error) {
      console.error(' AI analysis failed:', error.message);
      // Return fallback analysis instead of throwing
      return this.getFallbackAnalysis(content);
    }
  }

  // Fallback methods - ADD THESE TO FIX THE ERROR
  getFallbackSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + '.' || 'Summary: This note contains important information.';
  }

  getFallbackKeywords(text) {
    const words = text.split(/\s+/)
      .filter(word => word.length > 4)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
      .filter(word => word.length > 0);
    
    const uniqueWords = [...new Set(words)].slice(0, 5);
    return uniqueWords.length > 0 ? uniqueWords : ['content', 'notes', 'information', 'study', 'personal'];
  }

  analyzeToneFallback(text) {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;
    
    if (wordCount > 200 && sentenceCount > 8) return 'academic';
    if (text.includes('!') || text.toLowerCase().includes('i ') || text.includes('?')) return 'casual';
    return 'formal';
  }

  getFallbackQuestions() {
    return [
      'What is the main topic discussed in this text?',
      'What are the key points or important information presented?',
      'How can this information be applied or used in practice?'
    ];
  }

  getFallbackSimplified(text) {
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  }

  getFallbackAnalysis(content) {
    return {
      summary: this.getFallbackSummary(content),
      keywords: this.getFallbackKeywords(content),
      tone: this.analyzeToneFallback(content),
      questions: this.getFallbackQuestions(),
      simplifiedContent: this.getFallbackSimplified(content),
      lastAnalyzed: new Date(),
      modelUsed: 'Fallback (AI Service Unavailable)',
      status: 'fallback'
    };
  }

  // Test connection with new API
  async testConnection() {
    try {
      console.log(' Testing connection to new router API...');
      const testText = "The quick brown fox jumps over the lazy dog.";
      const result = await this.queryModel("facebook/bart-large-cnn", testText);
      return { success: true, data: result };
    } catch (error) {
      console.error(' Connection test failed:', error.message);
      return { 
        success: false, 
        error: error.message,
        suggestion: 'Please check your Hugging Face token and internet connection.'
      };
    }
  }
}

module.exports = new AIService();