import {User} from 'firebase/auth';
// import {AnyAction} from 'redux';
// import {
//   getUserData,
//   setCurrentUser,
//   signOut,
//   updateUserData,
// } from './user.action';
// import {UserType} from './user.types';

// export type UserInitialState = {
//   userAuth: User | undefined;
//   userData: UserType;
//   errors: {
//     'auth/wrong-password': boolean;
//     'auth/user-not-found': boolean;
//     'auth/email-already-in-use': boolean;
//     'auth/invalid-email': boolean;
//     'auth/weak-password': boolean;
//     genericError: boolean;
//   };
// };

// export const USER_INITIAL_STATE: UserInitialState = {
//   userAuth: undefined,
//   userData: {
//     accounts: [],
//     createdAt: new Date(),
//     email: '',
//     expenses: [],
//     name: '',
//     targets: [],
//   },
//   errors: {
//     'auth/wrong-password': false,
//     'auth/user-not-found': false,
//     'auth/email-already-in-use': false,
//     'auth/invalid-email': false,
//     'auth/weak-password': false,
//     genericError: false,
//   },
// };

// export const userReducer = (
//   state = USER_INITIAL_STATE,
//   action = {} as AnyAction
// ): UserInitialState => {
//   if (setCurrentUser.match(action)) {
//     return {...state, userAuth: action.payload};
//   }
//   if (signOut.match(action)) {
//     return {...state, userAuth: undefined};
//   }
//   if (getUserData.match(action)) {
//     return {...state, userData: action.payload};
//   }
//   if (updateUserData.match(action)) {
//     return {...state, userData: action.payload};
//   }
//   return state;
// };
