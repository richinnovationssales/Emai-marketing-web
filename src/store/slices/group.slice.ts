import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { groupService } from '@/lib/api/services/group.service';
import {
    Group,
    GroupWithContactsResponse,
    CreateGroupData,
    UpdateGroupData
} from '@/types/entities/group.types';
import { RootState } from '..';

interface GroupState {
    groups: Group[];
    currentGroup: GroupWithContactsResponse | null;
    loading: boolean;
    error: string | null;
    actionLoading: {
        create: boolean;
        update: boolean;
        delete: boolean;
    };
}

const initialState: GroupState = {
    groups: [],
    currentGroup: null,
    loading: false,
    error: null,
    actionLoading: {
        create: false,
        update: false,
        delete: false,
    },
};

// Async Thunks
export const fetchGroups = createAsyncThunk(
    'groups/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const groups = await groupService.getAll();
            return groups;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch groups');
        }
    }
);

export const fetchGroupById = createAsyncThunk(
    'groups/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const group = await groupService.getById(id);
            return group;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch group details');
        }
    }
);

export const createGroup = createAsyncThunk(
    'groups/create',
    async (data: CreateGroupData, { rejectWithValue }) => {
        try {
            const group = await groupService.create(data);
            return group;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create group');
        }
    }
);

export const updateGroup = createAsyncThunk(
    'groups/update',
    async ({ id, data }: { id: string; data: UpdateGroupData }, { rejectWithValue }) => {
        try {
            const group = await groupService.update(id, data);
            return group;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update group');
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'groups/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await groupService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete group');
        }
    }
);

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentGroup: (state) => {
            state.currentGroup = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch all groups
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action: PayloadAction<Group[]>) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch group by ID
        builder
            .addCase(fetchGroupById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupById.fulfilled, (state, action: PayloadAction<GroupWithContactsResponse>) => {
                state.loading = false;
                state.currentGroup = action.payload;
            })
            .addCase(fetchGroupById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create group
        builder
            .addCase(createGroup.pending, (state) => {
                state.actionLoading.create = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action: PayloadAction<Group>) => {
                state.actionLoading.create = false;
                state.groups.push(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.actionLoading.create = false;
                state.error = action.payload as string;
            });

        // Update group
        builder
            .addCase(updateGroup.pending, (state) => {
                state.actionLoading.update = true;
                state.error = null;
            })
            .addCase(updateGroup.fulfilled, (state, action: PayloadAction<Group>) => {
                state.actionLoading.update = false;
                const index = state.groups.findIndex(g => g.id === action.payload.id);
                if (index !== -1) {
                    state.groups[index] = action.payload;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.actionLoading.update = false;
                state.error = action.payload as string;
            });

        // Delete group
        builder
            .addCase(deleteGroup.pending, (state) => {
                state.actionLoading.delete = true;
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action: PayloadAction<string>) => {
                state.actionLoading.delete = false;
                state.groups = state.groups.filter(g => g.id !== action.payload);
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.actionLoading.delete = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearCurrentGroup } = groupSlice.actions;

// Selectors
export const selectGroups = (state: RootState) => state.groups?.groups || [];
export const selectCurrentGroup = (state: RootState) => state.groups?.currentGroup;
export const selectGroupsLoading = (state: RootState) => state.groups?.loading || false;
export const selectGroupsError = (state: RootState) => state.groups?.error;
export const selectGroupActionLoading = (state: RootState) => state.groups?.actionLoading;

export default groupSlice.reducer;
