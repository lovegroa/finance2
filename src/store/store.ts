import {compose, configureStore, Middleware} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userSlice from './user/user.slice';

// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//   }
// }

const middlewares: Middleware[] = [];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {user: userSlice},
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
});

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
