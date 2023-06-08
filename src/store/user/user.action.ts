import {FirebaseError} from 'firebase/app';
import {getRedirectResult, User, UserCredential} from 'firebase/auth';
import {
  auth,
  createAuthUserWithEmailAndPassword,
  CreateUserDocumentFromAuth,
  getUserInfo,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
  updateUserInfo,
} from '../../utils/firebase/firebase.utils';

import {AppDispatch} from '../store';
import {
  createUserFail,
  createUserStart,
  createUserSuccess,
  setUserDataFail,
  setUserDataStart,
  setUserDataSuccess,
  signInFail,
  signInStart,
  signInSuccess,
  signOutFail,
  signOutStart,
  signOutSuccess,
} from './user.slice';
import {UserType} from './user.types';

export const actionSignIn =
  (email: string, password: string) => async (appDispatch: AppDispatch) => {
    appDispatch(signInStart());
    let user: User | undefined;
    try {
      const response = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      if (!response) throw new Error();
      user = response.user;
      appDispatch(signInSuccess(JSON.stringify(user)));
    } catch (error) {
      appDispatch(signInFail());
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/wrong-password':
            alert('Incorrect password');
            break;
          case 'auth/user-not-found':
            alert('User not found');
            break;
          default:
            console.log('user sign in failed', JSON.stringify(error));
        }
      } else {
        console.log('user sign in failed', JSON.stringify(error));
      }
    }
    if (!user) return;
    appDispatch(setUserDataStart());
    try {
      const userData = await getUserInfo(user);
      if (!userData) throw new Error();
      appDispatch(setUserDataSuccess(userData));
    } catch (error) {
      console.log(error);
      appDispatch(setUserDataFail());
    }
  };

export const actionCreateUser =
  (email: string, password: string) => async (appDispatch: AppDispatch) => {
    appDispatch(createUserStart());
    let user: User | undefined;
    try {
      const response = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      if (!response) throw new Error();
      user = response.user;
      await CreateUserDocumentFromAuth(user); // only creates the document if the user does not exist
      appDispatch(createUserSuccess(JSON.stringify(user)));
    } catch (error) {
      appDispatch(createUserFail());
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('Email address is already in use.');
            break;
          case 'auth/invalid-email':
            alert('Email address is not valid.');
            break;
          case 'auth/weak-password':
            alert('Password is too weak.');
            break;
          default:
            console.log('Error creating user:', error.message);
        }
      } else {
        console.log('User creation error:', error);
      }
    }
    if (!user) return;
    appDispatch(setUserDataStart());
    try {
      const userData = await getUserInfo(user);
      if (!userData) throw new Error();
      appDispatch(setUserDataSuccess(userData));
    } catch (error) {
      appDispatch(setUserDataFail());
    }
  };

export const actionGoogleSignIn = () => async (appDispatch: AppDispatch) => {
  appDispatch(signInStart());
  let user: User | undefined;
  try {
    const response = await getRedirectResult(auth);
    if (!response) throw new Error();
    user = response.user;
    await CreateUserDocumentFromAuth(user); // only creates the document if the user does not exist
    appDispatch(signInSuccess(JSON.stringify(user)));
  } catch (error) {
    appDispatch(signInFail());
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/wrong-password':
          alert('Incorrect password');
          break;
        case 'auth/user-not-found':
          alert('User not found');
          break;
        default:
          console.log('user sign in failed', JSON.stringify(error));
      }
    } else {
      console.log('user sign in failed', JSON.stringify(error));
    }
  }
  if (!user) return;
  appDispatch(setUserDataStart());
  try {
    const userData = await getUserInfo(user);
    if (!userData) throw new Error();
    appDispatch(setUserDataSuccess(userData));
  } catch (error) {
    appDispatch(setUserDataFail());
  }
};

export const actionSignOut = () => async (appDispatch: AppDispatch) => {
  appDispatch(signOutStart());
  try {
    await signOutUser();
    appDispatch(signOutSuccess());
  } catch (error) {
    appDispatch(signOutFail());
  }
};

export const actionUpdateUserData =
  (userAuth: UserCredential['user'], userData: UserType) =>
  async (appDispatch: AppDispatch) => {
    appDispatch(setUserDataStart());
    try {
      const result = await updateUserInfo(userAuth, userData);
      if (!result) return;
      appDispatch(setUserDataSuccess(result));
    } catch (error) {
      appDispatch(setUserDataFail());
    }
  };
