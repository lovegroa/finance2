import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Currency} from 'firebase/analytics';
import {User} from 'firebase/auth';
import {
  convertDateToString,
  createTransactions,
  enhanceTargets,
  generateDatasets,
  generateLabels,
  hexToRgb,
  totalDatasets,
} from '../../utils/general/general.utils';
import {RootState} from '../store';
import {AccountType, Frequency, UserType} from './user.types';

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
    createUser: boolean;
  };
  loading: {
    signIn: boolean;
    signOut: boolean;
    setUserData: boolean;
    createUser: boolean;
  };
};

const initialState: UserInitialState = {
  userAuth: undefined,
  userData: {
    accounts: [],
    createdAt: new Date().toString(),
    email: '',
    transactions: [],
    name: '',
    targets: [],
    currency: 'GBP',
  },
  errors: {
    'auth/wrong-password': false,
    'auth/user-not-found': false,
    'auth/email-already-in-use': false,
    'auth/invalid-email': false,
    'auth/weak-password': false,
    genericError: false,
    signIn: false,
    createUser: false,
    signOut: false,
    setUserData: false,
  },
  loading: {
    signIn: false,
    signOut: false,
    setUserData: false,
    createUser: false,
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
    //createUser
    createUserStart: state => {
      state.loading.createUser = true;
      state.errors.createUser = false;
    },
    createUserSuccess: (state, action: PayloadAction<string>) => {
      state.userAuth = action.payload;
      state.loading.createUser = false;
      state.errors.createUser = false;
    },
    createUserFail: state => {
      state.errors.createUser = true;
      state.loading.createUser = false;
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
  createUserFail,
  createUserStart,
  createUserSuccess,
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserAuth = (state: RootState) =>
  state.user.userAuth ? (JSON.parse(state.user.userAuth) as User) : undefined;
export const selectLoggedIn = (state: RootState) => !!state.user.userAuth;
export const selectCurrency = (state: RootState) =>
  state.user.userData.currency;
export const selectUserData = (state: RootState) => state.user.userData;

//all core data is filtered by currency
export const selectAccounts = (state: RootState) => {
  const {currency, accounts} = state.user.userData;
  return accounts.filter(account => {
    return account.currency === currency;
  });
};
export const selectTransactions = (state: RootState) =>
  state.user.userData.transactions;
export const selectTargets = (state: RootState) => {
  const {currency, targets} = state.user.userData;
  return targets.filter(target => {
    return (
      target.currency === currency &&
      new Date(target.dateEnd) >= new Date(convertDateToString(new Date()))
    );
  });
};
export const selectUsedCurrencies = (state: RootState) =>
  Array.from(
    new Set(state.user.userData.accounts.map(account => account.currency))
  );

type Totals = {
  total: number;
  onlyCalculated: number;
  totalLimit: number;
  onlyCalculatedLimit: number;
};
export type AccountTotals = {
  debit: Totals;
  credit: Totals;
  total: Totals;
};
export const selectAccountTotals = (state: RootState): AccountTotals => {
  const accounts = selectAccounts(state);
  const {currency} = state.user.userData;
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

  return {
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
};

export const selectSignInLoading = (state: RootState) =>
  state.user.loading.signIn;
export default userSlice.reducer;

export type CashPerDay = {
  [key: string]: {
    dailyAmount: number;
    totalAmount: number;
    numberOfDays: number;
  };
};

export const selectCashPerDay = (state: RootState): CashPerDay => {
  const displayData = selectDisplayData(state);
  const targetDate = new Date('2023-07-24');
  const targetBalnce = 0;
  const labels: Date[] = generateLabels(targetDate, new Date());

  return displayData.reduce<CashPerDay>((acc, currency) => {
    const totalData = currency.total[0].data;
    const totalAmount = totalData[totalData.length - 1];

    acc[currency.currency] = {
      dailyAmount: (totalAmount - targetBalnce) / labels.length,
      totalAmount: totalAmount - targetBalnce,
      numberOfDays: labels.length,
    };
    return acc;
  }, {});
};

export const selectDisplayData = (state: RootState) => {
  const usedCurrencies = selectUsedCurrencies(state);
  const accounts = selectAccounts(state);
  const transactions = selectTransactions(state);
  const targetDate = new Date('2023-07-24');
  const labels: Date[] = generateLabels(targetDate, new Date());
  return usedCurrencies.map(currency => {
    const filteredAccounts = accounts.filter(
      account => account.currency === currency
    );
    const datasets = generateDatasets(labels, filteredAccounts, transactions);
    const totalColor = hexToRgb('#2c182f');

    return {
      currency: currency,
      accounts: datasets,
      total: [
        {
          label: currency,
          data: totalDatasets(labels, datasets),
          fill: true,
          backgroundColor: `rgba(${totalColor.r},${totalColor.g},${totalColor.b},0.2)`,
          borderColor: `rgba(${totalColor.r},${totalColor.g},${totalColor.b},1)`,
        },
      ],
    };
  });
};

export const selectIndividualTransactions = (state: RootState) => {
  const transactions = selectTransactions(state);
  const accounts = selectAccounts(state);

  return createTransactions(transactions, accounts, new Date('2023-07-24'));
};

export const selectEnhancedTargets = (state: RootState) => {
  const targets = selectTargets(state);
  const accounts = selectAccounts(state);
  const accountTotals = selectAccountTotals(state);
  const transactions = selectTransactions(state);

  return enhanceTargets(targets, accounts, accountTotals, transactions);
};

export const selectformatter = (state: RootState) => {
  const currency = selectCurrency(state);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const selectFrequencies = (): Set<Frequency> => {
  return new Set(['daily', 'weekly', 'monthly', 'yearly', 'once']);
};

export const selectIsUserDataLoading = (state: RootState) => {
  return state.user.loading.setUserData;
};
