import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesService } from '../../services/notesService';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (params, thunkAPI) => {
    try {
      const response = await notesService.getNotes(params);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to load notes. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const fetchNote = createAsyncThunk(
  'notes/fetchNote',
  async (id, thunkAPI) => {
    try {
      const response = await notesService.getNote(id);
      return response.data.note;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue('Note not found');
      }
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to load note. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, thunkAPI) => {
    try {
      const response = await notesService.createNote(noteData);
      return response.data.note;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create note. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, ...noteData }, thunkAPI) => {
    try {
      const response = await notesService.updateNote(id, noteData);
      return response.data.note;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue('Note not found');
      }
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to update note. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, thunkAPI) => {
    try {
      await notesService.deleteNote(id);
      return id;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue('Note not found');
      }
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to delete note. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const togglePin = createAsyncThunk(
  'notes/togglePin',
  async (id, thunkAPI) => {
    try {
      const response = await notesService.togglePin(id);
      return response.data.note;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue('Note not found');
      }
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to toggle pin. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// AI Analysis thunks
export const analyzeNote = createAsyncThunk(
  'notes/analyzeNote',
  async (id, thunkAPI) => {
    try {
      const response = await notesService.analyzeNote(id);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'AI analysis failed. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const analyzeText = createAsyncThunk(
  'notes/analyzeText',
  async (text, thunkAPI) => {
    try {
      const response = await notesService.analyzeText(text);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Text analysis failed. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getAIStatus = createAsyncThunk(
  'notes/getAIStatus',
  async (_, thunkAPI) => {
    try {
      const response = await notesService.getAIStatus();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        'AI service status check failed';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const analyzeMultipleNotes = createAsyncThunk(
  'notes/analyzeMultipleNotes',
  async (noteIds, thunkAPI) => {
    try {
      const response = await notesService.analyzeMultipleNotes(noteIds);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Bulk analysis failed. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const clearAIAnalysis = createAsyncThunk(
  'notes/clearAIAnalysis',
  async (id, thunkAPI) => {
    try {
      const response = await notesService.clearAIAnalysis(id);
      return response.data.note;
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to clear AI analysis. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    currentNote: null,
    loading: false,
    error: null,
    searchResults: [],
    filters: {
      category: '',
      search: ''
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalNotes: 0,
      hasNext: false,
      hasPrev: false
    },
    operationLoading: false, // For specific operations like create/update/delete
    aiLoading: null, // CHANGE: from false to null (will store note ID)
    aiStatus: null, // AI service status
    textAnalysis: null, // Store text analysis results
    bulkAnalysis: {
      processing: false,
      progress: 0,
      total: 0,
      results: []
    }
  },
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    searchNotes: (state, action) => {
      const { query, category } = action.payload;
      state.filters.search = query;
      state.filters.category = category;

      let filteredNotes = state.notes;

      if (query) {
        const searchTerm = query.toLowerCase();
        filteredNotes = filteredNotes.filter(note =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm) ||
          note.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          note.aiAnalysis?.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }

      if (category) {
        filteredNotes = filteredNotes.filter(note => note.category === category);
      }

      state.searchResults = filteredNotes;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.filters.search = '';
      state.filters.category = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOperationLoading: (state) => {
      state.operationLoading = false;
    },
    clearAILoading: (state) => {
      state.aiLoading = false;
    },
    clearTextAnalysis: (state) => {
      state.textAnalysis = null;
    },
    clearBulkAnalysis: (state) => {
      state.bulkAnalysis = {
        processing: false,
        progress: 0,
        total: 0,
        results: []
      };
    },
    updateBulkAnalysisProgress: (state, action) => {
      state.bulkAnalysis.progress = action.payload;
    },

    setAIStatus: (state, action) => {
      state.aiStatus = action.payload;
    },
    // ADD this new reducer to manually set analyzing note
    setAnalyzingNote: (state, action) => {
      state.aiLoading = action.payload; // payload should be note ID or null
    },


  },
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.notes = [];
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalNotes: 0,
          hasNext: false,
          hasPrev: false
        };
      })

      // Fetch Note
      .addCase(fetchNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
        state.error = null;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false;
        state.currentNote = null;
        state.error = action.payload;
      })

      // Create Note
      .addCase(createNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.notes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })

      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.currentNote && state.currentNote._id === action.payload._id) {
          state.currentNote = action.payload;
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })

      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.notes = state.notes.filter(note => note._id !== action.payload);
        if (state.currentNote && state.currentNote._id === action.payload) {
          state.currentNote = null;
        }
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })

      // Toggle Pin
      .addCase(togglePin.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(togglePin.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.notes.findIndex(note => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.currentNote && state.currentNote._id === action.payload._id) {
          state.currentNote = action.payload;
        }
        state.error = null;
      })
      .addCase(togglePin.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      })



      // AI Analysis - Single Note - UPDATED
      .addCase(analyzeNote.pending, (state, action) => {
        state.aiLoading = action.meta.arg; // Set to the note ID being analyzed
        state.error = null;
      })
      .addCase(analyzeNote.fulfilled, (state, action) => {
        state.aiLoading = null; // Clear the loading state
        // Update the note in the notes array
        const updatedNote = action.payload.note;
        const index = state.notes.findIndex(note => note._id === updatedNote._id);
        if (index !== -1) {
          state.notes[index] = updatedNote;
        }
        // Update currentNote if it's the one being analyzed
        if (state.currentNote && state.currentNote._id === updatedNote._id) {
          state.currentNote = updatedNote;
        }
        state.error = null;
      })
      .addCase(analyzeNote.rejected, (state, action) => {
        state.aiLoading = null; // Clear the loading state even on error
        state.error = action.payload;
      })

      // AI Analysis - Text - KEEP AS IS (boolean is fine for text analysis)
      .addCase(analyzeText.pending, (state) => {
        state.aiLoading = true; // Keep as boolean for text analysis
        state.error = null;
        state.textAnalysis = null;
      })
      .addCase(analyzeText.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.textAnalysis = action.payload.data.analysis;
        state.error = null;
      })
      .addCase(analyzeText.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload;
        state.textAnalysis = null;
      })

      // AI Status - KEEP AS IS
      .addCase(getAIStatus.pending, (state) => {
        // No loading state for status check to avoid UI flicker
      })
      .addCase(getAIStatus.fulfilled, (state, action) => {
        state.aiStatus = action.payload.data;
      })
      .addCase(getAIStatus.rejected, (state, action) => {
        state.aiStatus = {
          status: 'unavailable',
          error: action.payload,
          lastChecked: new Date().toISOString()
        };
      })




      // Bulk Analysis
      .addCase(analyzeMultipleNotes.pending, (state, action) => {
        state.bulkAnalysis.processing = true;
        state.bulkAnalysis.progress = 0;
        state.bulkAnalysis.total = action.meta.arg.length;
        state.bulkAnalysis.results = [];
        state.error = null;
      })
      .addCase(analyzeMultipleNotes.fulfilled, (state, action) => {
        state.bulkAnalysis.processing = false;
        state.bulkAnalysis.progress = state.bulkAnalysis.total;
        state.bulkAnalysis.results = action.payload.results;

        // Update notes with successful analyses
        action.payload.results.forEach(result => {
          if (result.success && result.data.note) {
            const index = state.notes.findIndex(note => note._id === result.data.note._id);
            if (index !== -1) {
              state.notes[index] = result.data.note;
            }
          }
        });

        state.error = null;
      })
      .addCase(analyzeMultipleNotes.rejected, (state, action) => {
        state.bulkAnalysis.processing = false;
        state.error = action.payload;
      })

      // Clear AI Analysis
      .addCase(clearAIAnalysis.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(clearAIAnalysis.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updatedNote = action.payload;
        const index = state.notes.findIndex(note => note._id === updatedNote._id);
        if (index !== -1) {
          state.notes[index] = updatedNote;
        }
        if (state.currentNote && state.currentNote._id === updatedNote._id) {
          state.currentNote = updatedNote;
        }
        state.error = null;
      })
      .addCase(clearAIAnalysis.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentNote,
  clearCurrentNote,
  searchNotes,
  clearSearch,
  clearError,
  clearOperationLoading,
  clearAILoading,
  clearTextAnalysis,
  clearBulkAnalysis,
  updateBulkAnalysisProgress,
  setAIStatus,
  setAnalyzingNote // ADD this to exports
} = notesSlice.actions;


// export  {
//   // ADD this to exports
//   // fetchNotes,
//   // fetchNote,
//   // createNote,
//   // updateNote,
//   // deleteNote,
//   // togglePin,
//   // analyzeNote,
//   // analyzeText,
//   // getAIStatus,
//   // analyzeMultipleNotes,
 
 
// } ;


export default notesSlice.reducer;