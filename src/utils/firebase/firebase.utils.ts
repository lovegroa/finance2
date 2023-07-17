import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {doc, getDoc, getFirestore, setDoc} from 'firebase/firestore';
import {UserType} from '../../store/user/user.types';

const firebaseConfig = {
  apiKey: 'AIzaSyBNrKgGJRp5K2R7WwpnJqqNOeC_nuIJ97w',
  authDomain: 'finance-c5c74.firebaseapp.com',
  projectId: 'finance-c5c74',
  storageBucket: 'finance-c5c74.appspot.com',
  messagingSenderId: '326886311087',
  appId: '1:326886311087:web:eb80903d2e52911347c05a',
  measurementId: 'G-S8E1CB8WHR',
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});

export const auth = getAuth();
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, provider);

export const db = getFirestore();

export const CreateUserDocumentFromAuth = async (
  userAuth: UserCredential['user'],
  additionalInformation: {[key: string]: string} = {}
) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) {
    const {displayName, email} = userAuth;
    const createdAt = new Date().toString();
    const user: UserType = {
      name: displayName,
      targets: [],
      accounts: [],
      transactions: [],
      email: email,
      createdAt: createdAt,
      currency: 'GBP',
      ...additionalInformation,
    };
    try {
      await setDoc(userDocRef, user);
    } catch (error) {
      console.log('there was an error creating user');
    }
    return userDocRef;
  }
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => signOut(auth);

export const getUserInfo = async (userAuth: UserCredential['user']) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    return userSnapshot.data() as UserType;
  }
};

export const updateUserInfo = async (
  userAuth: UserCredential['user'],
  userData: UserType
) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  try {
    await setDoc(userDocRef, userData);
    return userData;
  } catch (error) {
    console.log('there was an error updating the user');
    return;
  }
};
