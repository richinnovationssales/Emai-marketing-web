import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  CreateGreetingDTO,
  Greeting,
  UpdateGreetingDTO,
} from '@/types/entities/greeting.types';
import { greetingService } from '@/lib/api/services/greeting.service';

interface GreetingsState {
  greetings: Greeting[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: GreetingsState = {
  greetings: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchGreetings = createAsyncThunk(
  'greetings/fetchAll',
  async (includeInactive: boolean | undefined, { rejectWithValue }) => {
    try {
      return await greetingService.getAll(includeInactive ?? true);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch greetings'
      );
    }
  }
);

export const createGreeting = createAsyncThunk(
  'greetings/create',
  async (data: CreateGreetingDTO, { rejectWithValue }) => {
    try {
      return await greetingService.create(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create greeting'
      );
    }
  }
);

export const updateGreeting = createAsyncThunk(
  'greetings/update',
  async (
    { id, data }: { id: string; data: UpdateGreetingDTO },
    { rejectWithValue }
  ) => {
    try {
      return await greetingService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update greeting'
      );
    }
  }
);

export const deleteGreeting = createAsyncThunk(
  'greetings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await greetingService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete greeting'
      );
    }
  }
);

const greetingsSlice = createSlice({
  name: 'greetings',
  initialState,
  reducers: {
    clearGreetingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGreetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGreetings.fulfilled,
        (state, action: PayloadAction<Greeting[]>) => {
          state.loading = false;
          state.greetings = action.payload;
          state.initialized = true;
        }
      )
      .addCase(fetchGreetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createGreeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createGreeting.fulfilled,
        (state, action: PayloadAction<Greeting>) => {
          state.loading = false;
          state.greetings.push(action.payload);
        }
      )
      .addCase(createGreeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateGreeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateGreeting.fulfilled,
        (state, action: PayloadAction<Greeting>) => {
          state.loading = false;
          const index = state.greetings.findIndex(
            (g) => g.id === action.payload.id
          );
          if (index !== -1) {
            state.greetings[index] = action.payload;
          }
        }
      )
      .addCase(updateGreeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteGreeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteGreeting.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.greetings = state.greetings.filter(
            (g) => g.id !== action.payload
          );
        }
      )
      .addCase(deleteGreeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGreetingsError } = greetingsSlice.actions;

export const selectGreetings = (state: { greetings: GreetingsState }) =>
  state.greetings.greetings;
export const selectGreetingsLoading = (state: { greetings: GreetingsState }) =>
  state.greetings.loading;
export const selectGreetingsError = (state: { greetings: GreetingsState }) =>
  state.greetings.error;
export const selectGreetingsInitialized = (state: {
  greetings: GreetingsState;
}) => state.greetings.initialized;

export default greetingsSlice.reducer;
