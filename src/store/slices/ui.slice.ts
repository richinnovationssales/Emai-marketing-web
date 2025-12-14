import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
        duration?: number;
    }>;
    modal: {
        isOpen: boolean;
        type: string | null;
        data: any;
    };
}

const initialState: UIState = {
    sidebarOpen: true,
    theme: 'system',
    notifications: [],
    modal: {
        isOpen: false,
        type: null,
        data: null,
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
            state.notifications.push({
                id: Date.now().toString(),
                ...action.payload,
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
            state.modal.isOpen = true;
            state.modal.type = action.payload.type;
            state.modal.data = action.payload.data || null;
        },
        closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.type = null;
            state.modal.data = null;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    openModal,
    closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectModal = (state: { ui: UIState }) => state.ui.modal;
