export enum USER_ACTION_TYPES {
  SET_CURRENT_USER = 'user/SET_CURRENT_USER',
  GET_USER_DATA = 'user/GET_USER_DATA',
  UPDATE_USER_DATA = 'user/UPDATE_USER_DATA',
  CHECK_USER_SESSION = 'user/CHECK_USER_SESSION',
  GOOGLE_SIGN_IN_START = 'user/GOOGLE_SIGN_IN_START',
  EMAIL_SIGN_IN_START = 'user/EMAIL_SIGN_IN_START',
  SIGN_IN_SUCCESS = 'user/SIGN_IN_SUCCESS',
  SIGN_IN_FAILED = 'user/SIGN_IN_FAILED',
  SIGN_UP_START = 'user/SIGN_UP_START',
  SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS',
  SIGN_UP_FAILED = 'user/SIGN_UP_FAILED',
  SIGN_OUT = 'user/SIGN_OUT',
}

export type UserType = {
  accounts: Account[];
  createdAt: string;
  email: string | null;
  expenses: Expense[];
  name: string | null;
  targets: Target[];
};

type Target = {
  id: string;
  createdDate: string;
  targetDate: string;
  amount: number;
};

type Expense = {
  id: string;
  name: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  targetDate: string;
  amount: number;
  type: 'debit' | 'credit';
  accountId: string;
  paidDates: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';
};

type Account = {
  id: string;
  name: string;
  createdDate: string;
  balance: number;
  balanceLimit: number;
  accountType: AccountType;
  color: string;
  isPriority: boolean;
  includeInCalculations: boolean;
  currency: Currency;
};

export type Currency = 'GBP' | 'USD' | 'JPY';
export type AccountType = 'debit' | 'credit';