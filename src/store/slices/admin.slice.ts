import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Admin } from '@/types/entities/admin.types';
import { adminService } from '@/lib/api/services/admin.service';

interface AdminState {
    admins: Admin[];
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: AdminState = {
    admins: [],
    loading: false,
    error: null,
    initialized: false,
};

// Async thunks
export const fetchAdmins = createAsyncThunk(
    'admin/fetchAdmins',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminService.getAdmins();
            // Handle both direct array and wrapped response
            return Array.isArray(response) ? response : response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch admins');
        }
    }
);

export const createAdmin = createAsyncThunk(
    'admin/createAdmin',
    async (adminData: any, { rejectWithValue }) => {
        try {
            const response = await adminService.createAdmin(adminData);
        
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create admin');
        }
    }
);

export const updateAdmin = createAsyncThunk(
    'admin/updateAdmin',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await adminService.updateAdmin(id, data);
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update admin');
        }
    }
);

export const deleteAdmin = createAsyncThunk(
    'admin/deleteAdmin',
    async (id: string, { rejectWithValue }) => {
        try {
            await adminService.deleteAdmin(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete admin');
        }
    }
);

export const toggleAdminStatus = createAsyncThunk(
    'admin/toggleAdminStatus',
    async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
        try {
            const response = await adminService.toggleAdminStatus(id, isActive);
            return response.data || response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to toggle admin status');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAdminState: (state) => {
            state.admins = [];
            state.loading = false;
            state.error = null;
            state.initialized = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch admins
        builder
            .addCase(fetchAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<Admin[]>) => {
                state.loading = false;
                state.admins = action.payload;
                state.initialized = true;
            })
            .addCase(fetchAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create admin
        builder
            .addCase(createAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.loading = false;
                state.admins.push(action.payload);
            })
            .addCase(createAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Update admin
        builder
            .addCase(updateAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.loading = false;
                const index = state.admins.findIndex(admin => admin.id === action.payload.id);
                if (index !== -1) {
                    state.admins[index] = action.payload;
                }
            })
            .addCase(updateAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Delete admin
        builder
            .addCase(deleteAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAdmin.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.admins = state.admins.filter(admin => admin.id !== action.payload);
            })
            .addCase(deleteAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Toggle admin status
        builder
            .addCase(toggleAdminStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleAdminStatus.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.loading = false;
                const index = state.admins.findIndex(admin => admin.id === action.payload.id);
                if (index !== -1) {
                    state.admins[index] = action.payload;
                }
            })
            .addCase(toggleAdminStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;

// Selectors
export const selectAdmins = (state: { admin: AdminState }) => state.admin.admins;
export const selectAdminLoading = (state: { admin: AdminState }) => state.admin.loading;
export const selectAdminError = (state: { admin: AdminState }) => state.admin.error;
export const selectAdminInitialized = (state: { admin: AdminState }) => state.admin.initialized;
export const selectAdminById = (id: string) => (state: { admin: AdminState }) =>
    state.admin.admins.find(admin => admin.id === id);
