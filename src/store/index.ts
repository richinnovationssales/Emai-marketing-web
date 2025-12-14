import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import uiReducer from './slices/ui.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these paths in the state for date serialization
                ignoredPaths: ['ui.modal.data'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
