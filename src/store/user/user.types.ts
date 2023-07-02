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
  transactions: Transaction[];
  name: string | null;
  targets: Target[];
  currency: Currency;
};

export type Target = {
  _id: string;
  balanceEnd: string;
  currency: Currency;
  dateCreated: string;
  dateEnd: string;
};

export type Transaction = {
  id: string;
  name: string;
  createdDate: string;
  startDate: string;
  endDate?: string;
  noEndDate: boolean;
  amount: string;
  transactionType: 'debit' | 'credit';
  accountId: string;
  paidDates: string[];
  frequency: Frequency;
};

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';

export type Account = {
  id: string;
  name: string;
  createdDate: string;
  balance: string;
  balanceLimit: string;
  accountType: AccountType;
  color: string;
  isPriority: boolean;
  includeInCalculations: boolean;
  currency: Currency;
};

export type Currency = 'GBP' | 'USD' | 'JPY';
export type AccountType = 'debit' | 'credit';
