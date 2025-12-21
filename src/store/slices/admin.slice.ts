import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Admin } from '@/types/entities/admin.types';
import { Client, ClientWithStats, ClientDetails, CreateClientDTO, UpdateClientDTO, ClientAnalytics, CustomFieldDefinition } from '@/types/entities/client.types';
import { Plan, CreatePlanDTO, UpdatePlanDTO } from '@/types/entities/plan.types';
import { adminService } from '@/lib/api/services/admin.service';
import { clientService } from '@/lib/api/services/client.service';
import { planService } from '@/lib/api/services/plan.service';

interface AdminState {
    // Admin management
    admins: Admin[];
    adminLoading: boolean;
    adminError: string | null;
    adminInitialized: boolean;

    // Client management
    clients: ClientWithStats[];
    pendingClients: ClientWithStats[];
    selectedClient: ClientWithStats | null;
    selectedClientDetails: ClientDetails | null;
    clientAnalytics: ClientAnalytics | null;
    clientLoading: boolean;
    clientError: string | null;
    clientInitialized: boolean;

    // Custom field builder
    customFieldsBuilder: CustomFieldDefinition[];
    useDefaultFields: boolean;

    // Plan management
    plans: Plan[];
    selectedPlan: Plan | null;
    planClients: Client[];
    planLoading: boolean;
    planError: string | null;
    planInitialized: boolean;
}

const initialState: AdminState = {
    // Admin state
    admins: [],
    adminLoading: false,
    adminError: null,
    adminInitialized: false,

    // Client state
    clients: [],
    pendingClients: [],
    selectedClient: null,
    selectedClientDetails: null,
    clientAnalytics: null,
    clientLoading: false,
    clientError: null,
    clientInitialized: false,

    // Custom field builder state
    customFieldsBuilder: [],
    useDefaultFields: true,

    // Plan state
    plans: [],
    selectedPlan: null,
    planClients: [],
    planLoading: false,
    planError: null,
    planInitialized: false,
};

// ============ ADMIN ASYNC THUNKS ============
export const fetchAdmins = createAsyncThunk(
    'admin/fetchAdmins',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminService.getAdmins();
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

// ============ CLIENT ASYNC THUNKS ============
export const fetchClients = createAsyncThunk(
    'admin/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            return await clientService.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
        }
    }
);

export const fetchPendingClients = createAsyncThunk(
    'admin/fetchPendingClients',
    async (_, { rejectWithValue }) => {
        try {
            return await clientService.getPending();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending clients');
        }
    }
);

export const fetchClientById = createAsyncThunk(
    'admin/fetchClientById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client');
        }
    }
);

export const fetchClientDetails = createAsyncThunk(
    'admin/fetchClientDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.getDetails(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client details');
        }
    }
);

export const createClient = createAsyncThunk(
    'admin/createClient',
    async (clientData: CreateClientDTO, { rejectWithValue }) => {
        try {
            return await clientService.create(clientData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create client');
        }
    }
);

export const updateClient = createAsyncThunk(
    'admin/updateClient',
    async ({ id, data }: { id: string; data: UpdateClientDTO }, { rejectWithValue }) => {
        try {
            return await clientService.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update client');
        }
    }
);

export const deleteClient = createAsyncThunk(
    'admin/deleteClient',
    async (id: string, { rejectWithValue }) => {
        try {
            await clientService.deleteClient(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete client');
        }
    }
);

export const approveClient = createAsyncThunk(
    'admin/approveClient',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.approve(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve client');
        }
    }
);

export const rejectClient = createAsyncThunk(
    'admin/rejectClient',
    async (id: string, { rejectWithValue }) => {
        try {
            await clientService.reject(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject client');
        }
    }
);

export const deactivateClient = createAsyncThunk(
    'admin/deactivateClient',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.deactivate(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to deactivate client');
        }
    }
);

export const reactivateClient = createAsyncThunk(
    'admin/reactivateClient',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.reactivate(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reactivate client');
        }
    }
);

export const fetchClientAnalytics = createAsyncThunk(
    'admin/fetchClientAnalytics',
    async (id: string, { rejectWithValue }) => {
        try {
            return await clientService.getAnalytics(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch client analytics');
        }
    }
);

// ============ PLAN ASYNC THUNKS ============
export const fetchPlans = createAsyncThunk(
    'admin/fetchPlans',
    async (_, { rejectWithValue }) => {
        try {
            const plans = await planService.getAll();
            console.log({ plans });
            return plans;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
        }
    }
);

export const fetchPlanById = createAsyncThunk(
    'admin/fetchPlanById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await planService.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan');
        }
    }
);

export const fetchClientsByPlan = createAsyncThunk(
    'admin/fetchClientsByPlan',
    async (planId: string, { rejectWithValue }) => {
        try {
            return await planService.getClientsByPlan(planId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan clients');
        }
    }
);

export const createPlan = createAsyncThunk(
    'admin/createPlan',
    async (planData: CreatePlanDTO, { rejectWithValue }) => {
        try {
            return await planService.create(planData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create plan');
        }
    }
);

export const updatePlan = createAsyncThunk(
    'admin/updatePlan',
    async ({ id, data }: { id: string; data: UpdatePlanDTO }, { rejectWithValue }) => {
        try {
            return await planService.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update plan');
        }
    }
);

export const deletePlan = createAsyncThunk(
    'admin/deletePlan',
    async (id: string, { rejectWithValue }) => {
        try {
            await planService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete plan');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.adminError = null;
        },
        clearClientError: (state) => {
            state.clientError = null;
        },
        clearPlanError: (state) => {
            state.planError = null;
        },
        clearSelectedClient: (state) => {
            state.selectedClient = null;
            state.selectedClientDetails = null;
            state.clientAnalytics = null;
        },
        clearSelectedPlan: (state) => {
            state.selectedPlan = null;
            state.planClients = [];
        },
        resetAdminState: (state) => {
            Object.assign(state, initialState);
        },
        // Custom field builder actions
        addCustomField: (state, action: PayloadAction<CustomFieldDefinition>) => {
            state.customFieldsBuilder.push(action.payload);
        },
        updateCustomField: (state, action: PayloadAction<{ index: number; field: CustomFieldDefinition }>) => {
            state.customFieldsBuilder[action.payload.index] = action.payload.field;
        },
        removeCustomField: (state, action: PayloadAction<number>) => {
            state.customFieldsBuilder.splice(action.payload, 1);
        },
        reorderCustomField: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const { fromIndex, toIndex } = action.payload;
            const [movedField] = state.customFieldsBuilder.splice(fromIndex, 1);
            state.customFieldsBuilder.splice(toIndex, 0, movedField);
            // Update display order
            state.customFieldsBuilder.forEach((field, index) => {
                field.displayOrder = index;
            });
        },
        setUseDefaultFields: (state, action: PayloadAction<boolean>) => {
            state.useDefaultFields = action.payload;
            if (action.payload) {
                state.customFieldsBuilder = [];
            }
        },
        clearCustomFieldsBuilder: (state) => {
            state.customFieldsBuilder = [];
            state.useDefaultFields = true;
        },
        setCustomFields: (state, action: PayloadAction<CustomFieldDefinition[]>) => {
            state.customFieldsBuilder = action.payload;
        },
    },
    extraReducers: (builder) => {
        // ============ ADMIN REDUCERS ============
        builder
            .addCase(fetchAdmins.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<Admin[]>) => {
                state.adminLoading = false;
                state.admins = action.payload;
                state.adminInitialized = true;
            })
            .addCase(fetchAdmins.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload as string;
            });

        builder
            .addCase(createAdmin.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(createAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.adminLoading = false;
                state.admins.push(action.payload);
            })
            .addCase(createAdmin.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload as string;
            });

        builder
            .addCase(updateAdmin.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(updateAdmin.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.adminLoading = false;
                const index = state.admins.findIndex(admin => admin.id === action.payload.id);
                if (index !== -1) {
                    state.admins[index] = action.payload;
                }
            })
            .addCase(updateAdmin.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload as string;
            });

        builder
            .addCase(deleteAdmin.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(deleteAdmin.fulfilled, (state, action: PayloadAction<string>) => {
                state.adminLoading = false;
                state.admins = state.admins.filter(admin => admin.id !== action.payload);
            })
            .addCase(deleteAdmin.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload as string;
            });

        builder
            .addCase(toggleAdminStatus.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(toggleAdminStatus.fulfilled, (state, action: PayloadAction<Admin>) => {
                state.adminLoading = false;
                const index = state.admins.findIndex(admin => admin.id === action.payload.id);
                if (index !== -1) {
                    state.admins[index] = action.payload;
                }
            })
            .addCase(toggleAdminStatus.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload as string;
            });

        // ============ CLIENT REDUCERS ============
        builder
            .addCase(fetchClients.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(fetchClients.fulfilled, (state, action: PayloadAction<ClientWithStats[]>) => {
                state.clientLoading = false;
                state.clients = action.payload;
                state.clientInitialized = true;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(fetchPendingClients.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(fetchPendingClients.fulfilled, (state, action: PayloadAction<ClientWithStats[]>) => {
                state.clientLoading = false;
                state.pendingClients = action.payload;
            })
            .addCase(fetchPendingClients.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(fetchClientById.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<ClientWithStats>) => {
                state.clientLoading = false;
                state.selectedClient = action.payload;
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(fetchClientDetails.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(fetchClientDetails.fulfilled, (state, action: PayloadAction<ClientDetails>) => {
                state.clientLoading = false;
                state.selectedClientDetails = action.payload;
            })
            .addCase(fetchClientDetails.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(createClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
                state.clientLoading = false;
                // Add to clients array (will be properly typed after refetch)
                state.clients.push(action.payload as any);
            })
            .addCase(createClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(updateClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
                state.clientLoading = false;
                const index = state.clients.findIndex(client => client.id === action.payload.id);
                if (index !== -1) {
                    state.clients[index] = { ...state.clients[index], ...action.payload };
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(deleteClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(deleteClient.fulfilled, (state, action: PayloadAction<string>) => {
                state.clientLoading = false;
                state.clients = state.clients.filter(client => client.id !== action.payload);
                state.pendingClients = state.pendingClients.filter(client => client.id !== action.payload);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(approveClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(approveClient.fulfilled, (state, action: PayloadAction<Client>) => {
                state.clientLoading = false;
                const index = state.clients.findIndex(client => client.id === action.payload.id);
                if (index !== -1) {
                    state.clients[index] = { ...state.clients[index], ...action.payload };
                }
                state.pendingClients = state.pendingClients.filter(client => client.id !== action.payload.id);
            })
            .addCase(approveClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(rejectClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(rejectClient.fulfilled, (state, action: PayloadAction<string>) => {
                state.clientLoading = false;
                state.clients = state.clients.filter(client => client.id !== action.payload);
                state.pendingClients = state.pendingClients.filter(client => client.id !== action.payload);
            })
            .addCase(rejectClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(deactivateClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(deactivateClient.fulfilled, (state, action: PayloadAction<Client>) => {
                state.clientLoading = false;
                const index = state.clients.findIndex(client => client.id === action.payload.id);
                if (index !== -1) {
                    state.clients[index] = { ...state.clients[index], ...action.payload };
                }
            })
            .addCase(deactivateClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(reactivateClient.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(reactivateClient.fulfilled, (state, action: PayloadAction<Client>) => {
                state.clientLoading = false;
                const index = state.clients.findIndex(client => client.id === action.payload.id);
                if (index !== -1) {
                    state.clients[index] = { ...state.clients[index], ...action.payload };
                }
            })
            .addCase(reactivateClient.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        builder
            .addCase(fetchClientAnalytics.pending, (state) => {
                state.clientLoading = true;
                state.clientError = null;
            })
            .addCase(fetchClientAnalytics.fulfilled, (state, action: PayloadAction<ClientAnalytics>) => {
                state.clientLoading = false;
                state.clientAnalytics = action.payload;
            })
            .addCase(fetchClientAnalytics.rejected, (state, action) => {
                state.clientLoading = false;
                state.clientError = action.payload as string;
            });

        // ============ PLAN REDUCERS ============
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
                console.log({ plans: action.payload });
                state.planLoading = false;
                state.plans = action.payload;
                state.planInitialized = true;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });

        builder
            .addCase(fetchPlanById.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(fetchPlanById.fulfilled, (state, action: PayloadAction<Plan>) => {
                state.planLoading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(fetchPlanById.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });

        builder
            .addCase(fetchClientsByPlan.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(fetchClientsByPlan.fulfilled, (state, action: PayloadAction<Client[]>) => {
                state.planLoading = false;
                state.planClients = action.payload;
            })
            .addCase(fetchClientsByPlan.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });

        builder
            .addCase(createPlan.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(createPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
                state.planLoading = false;
                state.plans.push(action.payload);
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });

        builder
            .addCase(updatePlan.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
                state.planLoading = false;
                const index = state.plans.findIndex(plan => plan.id === action.payload.id);
                if (index !== -1) {
                    state.plans[index] = action.payload;
                }
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });

        builder
            .addCase(deletePlan.pending, (state) => {
                state.planLoading = true;
                state.planError = null;
            })
            .addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
                state.planLoading = false;
                state.plans = state.plans.filter(plan => plan.id !== action.payload);
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.planLoading = false;
                state.planError = action.payload as string;
            });
    },
});

export const {
    clearAdminError,
    clearClientError,
    clearPlanError,
    clearSelectedClient,
    clearSelectedPlan,
    resetAdminState,
    addCustomField,
    updateCustomField,
    removeCustomField,
    reorderCustomField,
    setUseDefaultFields,
    clearCustomFieldsBuilder,
    setCustomFields
} = adminSlice.actions;

export default adminSlice.reducer;

// ============ SELECTORS ============
// Admin selectors
export const selectAdmins = (state: { admin: AdminState }) => state.admin.admins;
export const selectAdminLoading = (state: { admin: AdminState }) => state.admin.adminLoading;
export const selectAdminError = (state: { admin: AdminState }) => state.admin.adminError;
export const selectAdminInitialized = (state: { admin: AdminState }) => state.admin.adminInitialized;
export const selectAdminById = (id: string) => (state: { admin: AdminState }) =>
    state.admin.admins.find(admin => admin.id === id);

// Client selectors
export const selectClients = (state: { admin: AdminState }) => state.admin.clients;
export const selectPendingClients = (state: { admin: AdminState }) => state.admin.pendingClients;
export const selectSelectedClient = (state: { admin: AdminState }) => state.admin.selectedClient;
export const selectSelectedClientDetails = (state: { admin: AdminState }) => state.admin.selectedClientDetails;
export const selectClientAnalytics = (state: { admin: AdminState }) => state.admin.clientAnalytics;
export const selectClientLoading = (state: { admin: AdminState }) => state.admin.clientLoading;
export const selectClientError = (state: { admin: AdminState }) => state.admin.clientError;
export const selectClientInitialized = (state: { admin: AdminState }) => state.admin.clientInitialized;
export const selectClientById = (id: string) => (state: { admin: AdminState }) =>
    state.admin.clients.find(client => client.id === id);

// Plan selectors
export const selectPlans = (state: { admin: AdminState }) => state.admin.plans;
export const selectSelectedPlan = (state: { admin: AdminState }) => state.admin.selectedPlan;
export const selectPlanClients = (state: { admin: AdminState }) => state.admin.planClients;
export const selectPlanLoading = (state: { admin: AdminState }) => state.admin.planLoading;
export const selectPlanError = (state: { admin: AdminState }) => state.admin.planError;
export const selectPlanInitialized = (state: { admin: AdminState }) => state.admin.planInitialized;
export const selectPlanById = (id: string) => (state: { admin: AdminState }) =>
    state.admin.plans.find(plan => plan.id === id);

// Custom field builder selectors
export const selectCustomFieldsBuilder = (state: { admin: AdminState }) => state.admin.customFieldsBuilder;
export const selectUseDefaultFields = (state: { admin: AdminState }) => state.admin.useDefaultFields;
export const selectCustomFieldsBuilderCount = (state: { admin: AdminState }) => state.admin.customFieldsBuilder.length;

