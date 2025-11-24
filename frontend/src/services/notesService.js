import api from './api';

export const notesService = {
  // Get all notes with filters
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Get single note
  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Toggle pin status
  togglePin: async (id) => {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/notes/dashboard/stats');
    return response.data;
  },

  // AI Analysis Services
  analyzeNote: async (id) => {
    const response = await api.post(`/ai/analyze/note/${id}`);
    return response.data;
  },

  analyzeText: async (text) => {
    const response = await api.post('/ai/analyze/text', { text });
    return response.data;
  },

  getAIStatus: async () => {
    const response = await api.get('/ai/status');
    return response.data;
  },

  // Bulk analyze multiple notes
  analyzeMultipleNotes: async (noteIds) => {
    const promises = noteIds.map(id => 
      api.post(`/ai/analyze/note/${id}`)
        .then(response => ({ id, success: true, data: response.data }))
        .catch(error => ({ 
          id, 
          success: false, 
          error: error.response?.data?.error || 'Analysis failed' 
        }))
    );
    
    const results = await Promise.all(promises);
    return {
      success: true,
      data: {
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    };
  },

  // Clear AI analysis from a note
  clearAIAnalysis: async (id) => {
    const response = await api.patch(`/notes/${id}`, { 
      aiAnalysis: null 
    });
    return response.data;
  },

  // Reanalyze all notes with AI (for admin/background tasks)
  reanalyzeAllNotes: async () => {
    const response = await api.post('/ai/analyze/all');
    return response.data;
  }
};