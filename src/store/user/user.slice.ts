import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Currency} from 'firebase/analytics';
import {User} from 'firebase/auth';
import {RootState} from '../store';
import {AccountType, UserType} from './user.types';

type UserInitialState = {
  userAuth: string | undefined;
  userData: UserType;
  errors: {
    'auth/wrong-password': boolean;
    'auth/user-not-found': boolean;
    'auth/email-already-in-use': boolean;
    'auth/invalid-email': boolean;
    'auth/weak-password': boolean;
    genericError: boolean;
    signIn: boolean;
    signOut: boolean;
    setUserData: boolean;
  };
  loading: {
    signIn: boolean;
    signOut: boolean;
    setUserData: boolean;
  };
};

const initialState: UserInitialState = {
  userAuth: undefined,
  userData: {
    accounts: [],
    createdAt: new Date().toString(),
    email: '',
    expenses: [],
    name: '',
    targets: [],
  },
  errors: {
    'auth/wrong-password': false,
    'auth/user-not-found': false,
    'auth/email-already-in-use': false,
    'auth/invalid-email': false,
    'auth/weak-password': false,
    genericError: false,
    signIn: false,
    signOut: false,
    setUserData: false,
  },
  loading: {
    signIn: false,
    signOut: false,
    setUserData: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //signIn:
    signInStart: state => {
      state.loading.signIn = true;
      state.errors.signIn = false;
    },
    signInSuccess: (state, action: PayloadAction<string>) => {
      state.userAuth = action.payload;
      state.loading.signIn = false;
      state.errors.signIn = false;
    },
    signInFail: state => {
      state.errors.signIn = true;
      state.loading.signIn = false;
    },
    //signOut:
    signOutStart: state => {
      state.loading.signOut = true;
      state.errors.signOut = false;
    },
    signOutSuccess: state => {
      state.userAuth = undefined;
      state.loading.signOut = false;
      state.errors.signOut = false;
    },
    signOutFail: state => {
      state.loading.signOut = false;
      state.errors.signOut = true;
    },
    //setUserData:
    setUserDataStart: state => {
      state.loading.setUserData = true;
      state.errors.setUserData = false;
    },
    setUserDataSuccess: (state, action: PayloadAction<UserType>) => {
      state.userData = action.payload;
      state.loading.setUserData = false;
      state.errors.setUserData = false;
    },
    setUserDataFail: state => {
      state.loading.setUserData = false;
      state.errors.setUserData = true;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  signOutStart,
  signOutSuccess,
  signOutFail,
  setUserDataStart,
  setUserDataSuccess,
  setUserDataFail,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserAuth = (state: RootState) =>
  state.user.userAuth ? (JSON.parse(state.user.userAuth) as User) : undefined;
export const selectLoggedIn = (state: RootState) => !!state.user.userAuth;
export const selectUserData = (state: RootState) => state.user.userData;
export const selectAccounts = (state: RootState) =>
  state.user.userData.accounts;
export const selectExpenses = (state: RootState) =>
  state.user.userData.expenses;
export const selectTargets = (state: RootState) => state.user.userData.targets;
export const selectUsedCurrencies = (state: RootState) =>
  state.user.userData.accounts.map(account => account.currency);

type Totals = {
  total: number;
  onlyCalculated: number;
  totalLimit: number;
  onlyCalculatedLimit: number;
};
type AccountTotals = {
  currency: 'JPY' | 'USD' | 'GBP';
  debit: Totals;
  credit: Totals;
  total: Totals;
};
export const selectAccountTotals = (state: RootState): AccountTotals[] => {
  const {accounts} = state.user.userData;
  const usedCurrencies = Array.from(
    new Set(accounts.map(account => account.currency))
  );

  const total = (
    currency: Currency,
    onlyCalculated: boolean,
    accountType: AccountType,
    balanceOrLimit: 'balance' | 'limit'
  ) => {
    let filteredAccounts = accounts.filter(
      accounts => accounts.currency === currency
    );
    if (onlyCalculated) {
      filteredAccounts = filteredAccounts.filter(
        account => account.includeInCalculations
      );
    }
    if (accountType === 'credit') {
      filteredAccounts = filteredAccounts.filter(
        account => account.accountType === 'credit'
      );
    } else if (accountType === 'debit') {
      filteredAccounts = filteredAccounts.filter(
        account => account.accountType === 'debit'
      );
    }

    return filteredAccounts.reduce((acc, account) => {
      return (acc +=
        balanceOrLimit === 'balance'
          ? Number(account.balance)
          : Number(account.balanceLimit));
    }, 0);
  };

  return usedCurrencies.map<AccountTotals>(currency => {
    return {
      currency: currency,
      debit: {
        total: total(currency, false, 'debit', 'balance'),
        onlyCalculated: total(currency, true, 'debit', 'balance'),
        totalLimit: total(currency, false, 'debit', 'limit'),
        onlyCalculatedLimit: total(currency, true, 'debit', 'limit'),
      },
      credit: {
        total: total(currency, false, 'credit', 'balance'),
        onlyCalculated: total(currency, true, 'credit', 'balance'),
        totalLimit: total(currency, false, 'credit', 'limit'),
        onlyCalculatedLimit: total(currency, true, 'credit', 'limit'),
      },
      total: {
        total:
          total(currency, false, 'debit', 'balance') -
          total(currency, false, 'credit', 'balance'),
        onlyCalculated:
          total(currency, true, 'debit', 'balance') -
          total(currency, true, 'credit', 'balance'),
        totalLimit:
          total(currency, false, 'debit', 'limit') -
          total(currency, false, 'credit', 'limit'),
        onlyCalculatedLimit:
          total(currency, true, 'debit', 'limit') -
          total(currency, true, 'credit', 'limit'),
      },
    };
  });
};
export default userSlice.reducer;