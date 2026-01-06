import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Template,
  CreateTemplateDTO,
  UpdateTemplateDTO,
  TemplateFilters,
} from '@/types/entities/template.types';
import { templateService } from '@/lib/api/services/template.service';

/* =========================
   State
========================= */

interface TemplateState {
  items: Template[];
  selectedTemplate: Template | null;
  nextCursor: string | null;
  filters: TemplateFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  items: [],
  selectedTemplate: null,
  nextCursor: null,
  filters: {},
  isLoading: false,
  error: null,
};

/* =========================
   Thunks
========================= */

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (params: TemplateFilters, { rejectWithValue }) => {
    try {
      return await templateService.getAll(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch templates'
      );
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await templateService.getById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch template'
      );
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (data: CreateTemplateDTO, { rejectWithValue }) => {
    try {
      return await templateService.create(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create template'
      );
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async (
    { id, data }: { id: string; data: UpdateTemplateDTO },
    { rejectWithValue }
  ) => {
    try {
      const sanitizedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null)
      );
      return await templateService.update(id, sanitizedData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update template'
      );
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      await templateService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete template'
      );
    }
  }
);

/* =========================
   Slice
========================= */

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplateFilters: (state, action: PayloadAction<TemplateFilters>) => {
      state.filters = action.payload;
    },
    clearTemplateError: (state) => {
      state.error = null;
    },
    setSelectedTemplate: (state, action: PayloadAction<Template | null>) => {
      state.selectedTemplate = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Templates
    builder.addCase(fetchTemplates.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.meta.arg.cursor) {
        state.items = [...state.items, ...action.payload.data];
      } else {
        state.items = action.payload.data;
      }

    //   state.nextCursor = action.payload.nextCursor;
    });
    builder.addCase(fetchTemplates.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Template By ID
    builder.addCase(fetchTemplateById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    // builder.addCase(fetchTemplateById.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.selectedTemplate = action.payload;
    // });
    builder.addCase(fetchTemplateById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Template
    // builder.addCase(createTemplate.fulfilled, (state, action) => {
    //   state.items.unshift(action.payload);
    // });

    // Update Template
    // builder.addCase(updateTemplate.fulfilled, (state, action) => {
    //   const index = state.items.findIndex(
    //     (t) => t.id === action.payload.id
    //   );
    //   if (index !== -1) {
    //     state.items[index] = action.payload;
    //   }
    //   if (state.selectedTemplate?.id === action.payload.id) {
    //     state.selectedTemplate = action.payload;
    //   }
    // });

    // Delete Template
    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (t) => t.id !== action.payload
      );
    });
  },
});

export const {
  setTemplateFilters,
  clearTemplateError,
  setSelectedTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;

/* =========================
   Selectors
========================= */

export const selectTemplates = (state: { templates: TemplateState }) =>
  state.templates.items;

export const selectSelectedTemplate = (state: { templates: TemplateState }) =>
  state.templates.selectedTemplate;

export const selectTemplateLoading = (state: { templates: TemplateState }) =>
  state.templates.isLoading;

export const selectTemplateError = (state: { templates: TemplateState }) =>
  state.templates.error;

export const selectTemplateFilters = (state: { templates: TemplateState }) =>
  state.templates.filters;

export const selectNextTemplateCursor = (state: { templates: TemplateState }) =>
  state.templates.nextCursor;
