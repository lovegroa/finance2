import {configureStore, Middleware} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userSlice from './user/user.slice';

const middlewares: Middleware[] = [];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {user: userSlice},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
