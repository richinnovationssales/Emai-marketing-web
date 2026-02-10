import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact, CreateContactDTO, ContactFilters, BulkImportResult, UpdateContactDTO } from '@/types/entities/contact.types';
import { CustomField } from '@/types/entities/custom-field.types';
import { contactService } from '@/lib/api/services/contact.service';
import { customFieldService } from '@/lib/api/services/custom-field.service';

interface ContactState {
    items: Contact[]; // Current list of contacts
    selectedContact: Contact | null;
    customFieldConfig: CustomField[]; // Config for validation/rendering
    nextCursor: string | null;
    filters: ContactFilters;
    isLoading: boolean; // General loading state
    isUploading: boolean; // Specific to bulk upload
    error: string | null;
    uploadResult: BulkImportResult | null;
}

const initialState: ContactState = {
    items: [],
    selectedContact: null,
    customFieldConfig: [],
    nextCursor: null,
    filters: {},
    isLoading: false,
    isUploading: false,
    error: null,
    uploadResult: null,
};

// --- Thunks ---

export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (params: ContactFilters, { rejectWithValue }) => {
        try {
            return await contactService.getAll(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
        }
    }
);

export const fetchCustomFields = createAsyncThunk(
    'contacts/fetchCustomFields',
    async (params: { includeInactive?: boolean } | undefined, { rejectWithValue }) => {
        try {
            const result = await customFieldService.getAll(params);
            return result.data; // Expecting CustomField[]
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch custom fields');
        }
    }
);

export const fetchContactById = createAsyncThunk(
    'contacts/fetchContactById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await contactService.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact');
        }
    }
);


export const createContact = createAsyncThunk(
    'contacts/createContact',
    async (data: CreateContactDTO, { rejectWithValue }) => {
        try {
            return await contactService.create(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create contact');
        }
    }
);

export const updateContact = createAsyncThunk(
    'contacts/updateContact',
    async ({ id, data }: { id: string; data: Partial<CreateContactDTO> }, { rejectWithValue }) => {
        try {
            // Ensure no nulls are passed if DTO expects undefined
            const sanitizedData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== null)
            );
            return await contactService.update(id, sanitizedData as UpdateContactDTO);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact');
        }
    }
);

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (id: string, { rejectWithValue }) => {
        try {
            await contactService.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete contact');
        }
    }
);

export const bulkUploadContacts = createAsyncThunk(
    'contacts/bulkUpload',
    async ({ file, groupId }: { file: File; groupId?: string }, { rejectWithValue }) => {
        try {
            return await contactService.bulkUpload(file, groupId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload contacts');
        }
    }
);

export const bulkDeleteContacts = createAsyncThunk(
    'contacts/bulkDelete',
    async (ids: string[], { rejectWithValue }) => {
        try {
            await contactService.bulkDelete(ids);
            return ids;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete contacts');
        }
    }
);

// --- Slice ---

const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ContactFilters>) => {
            state.filters = action.payload;
        },
        clearContactError: (state) => {
            state.error = null;
        },
        resetUploadResult: (state) => {
            state.uploadResult = null;
        },
        setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
            state.selectedContact = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Contacts
        builder.addCase(fetchContacts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchContacts.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.meta.arg.cursor) {
                // Determine if we append or replace. If cursor is provided, likely appending (infinite scroll)
                // But typically for pages I might replace.
                // Assuming standard "Load More" appends.
                state.items = [...state.items, ...action.payload.data];
            } else {
                // If no cursor (initial load or refresh), replace.
                state.items = action.payload.data;
            }
            state.nextCursor = action.payload.nextCursor;
        });
        builder.addCase(fetchContacts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Fetch Custom Fields
        builder.addCase(fetchCustomFields.fulfilled, (state, action) => {
            state.customFieldConfig = action.payload;
        });

        // Fetch Contact By ID
        builder.addCase(fetchContactById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchContactById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.selectedContact = action.payload;
        });
        builder.addCase(fetchContactById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });


        // Create Contact
        builder.addCase(createContact.fulfilled, (state, action) => {
            // Optimistically add to top of list
            state.items.unshift(action.payload);
        });

        // Update Contact
        builder.addCase(updateContact.fulfilled, (state, action) => {
            if (!action.payload) return;
            const index = state.items.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedContact?.id === action.payload.id) {
                state.selectedContact = action.payload;
            }
        });

        // Delete Contact
        builder.addCase(deleteContact.fulfilled, (state, action) => {
            state.items = state.items.filter(c => c.id !== action.payload);
        });

        // Bulk Upload
        builder.addCase(bulkUploadContacts.pending, (state) => {
            state.isUploading = true;
            state.error = null;
            state.uploadResult = null;
        });
        builder.addCase(bulkUploadContacts.fulfilled, (state, action) => {
            state.isUploading = false;
            state.uploadResult = action.payload;
        });
        builder.addCase(bulkUploadContacts.rejected, (state, action) => {
            state.isUploading = false;
            state.error = action.payload as string;
        });

        // Bulk Delete
        builder.addCase(bulkDeleteContacts.fulfilled, (state, action) => {
            state.items = state.items.filter(c => !action.payload.includes(c.id));
            if (state.selectedContact && action.payload.includes(state.selectedContact.id)) {
                state.selectedContact = null;
            }
        });
    },
});



export const { setFilters, clearContactError, resetUploadResult, setSelectedContact } = contactSlice.actions;
export default contactSlice.reducer;

// Selectors
export const selectContacts = (state: { contacts: ContactState }) => state.contacts.items;
export const selectSelectedContact = (state: { contacts: ContactState }) => state.contacts.selectedContact;
export const selectContactLoading = (state: { contacts: ContactState }) => state.contacts.isLoading;
export const selectContactError = (state: { contacts: ContactState }) => state.contacts.error;
export const selectCustomFieldConfig = (state: { contacts: ContactState }) => state.contacts.customFieldConfig;
export const selectNextCursor = (state: { contacts: ContactState }) => state.contacts.nextCursor;
export const selectUploadResult = (state: { contacts: ContactState }) => state.contacts.uploadResult;
export const selectIsUploading = (state: { contacts: ContactState }) => state.contacts.isUploading;
