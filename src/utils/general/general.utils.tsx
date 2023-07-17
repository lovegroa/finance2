import {Account, Target, Transaction} from '../../store/user/user.types';
import {addMonths} from 'date-fns';
import {ChartDataset, Point} from 'chart.js';
import {AccountTotals} from '../../store/user/user.slice';

export const convertDateToString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T')[0];
};

export const generateLabels = (dateEnd: Date, dateBegin: Date) => {
  const labels = [];
  const dateBeginCopy = new Date(dateBegin); // Make a copy of dateBegin
  const dateEndCopy = new Date(dateEnd); // Make a copy of dateEnd

  // Reset the time of dateBeginCopy to 00:00:00 to avoid issues with time comparison
  dateBeginCopy.setHours(0, 0, 0, 0);

  // Reset the time of dateEndCopy to 23:59:59 to include the entire date
  dateEndCopy.setHours(23, 59, 59, 999);

  // Start iterating from dateBeginCopy until we reach dateEndCopy
  for (let i = dateBeginCopy; i <= dateEndCopy; i.setDate(i.getDate() + 1)) {
    labels.push(new Date(i));
  }

  return labels;
};

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      };
}

export type GeneratedDataset = {
  priority: boolean;
  dataset: ChartDataset<'line', (number | Point | null)[]>;
};

export const generateAccountData = (
  account: Account,
  listTransactions: IndividualTransaction[],
  dates: Date[]
) => {
  let balance = Number(account.balance);
  return dates.map((date, index) => {
    const amount = listTransactions
      .filter(transaction => {
        if (!index) {
          //on the first date, it looks to see if anything older has not been paid yet
          return new Date(transaction.date).getTime() <= date.getTime();
        } else {
          return transaction.date === convertDateToString(date);
        }
      })
      .reduce((acc, transaction) => {
        if (transaction.transactionType === 'debit') {
          acc += Number(transaction.amount);
        } else {
          acc -= Number(transaction.amount);
        }
        return acc;
      }, 0);
    balance -= amount;
    return balance;
  });
};

export const generateDatasets = (
  dates: Date[],
  accounts: Account[],
  transactions: Transaction[]
): GeneratedDataset[] => {
  return accounts.map(account => {
    //find all transactions by account
    const accountTransactions = transactions.filter(
      transaction => transaction.accountId === account.id
    );
    //work out acountTransactions by date within the timeframe
    const accountListTransactions = accountTransactions.reduce<
      IndividualTransaction[]
    >((acc, accountTransaction) => {
      acc = acc.concat(
        listIndividualTransactions(dates[dates.length - 1], accountTransaction)
      );
      return acc;
    }, []);

    const accountColor = hexToRgb(account.color);

    return {
      priority: account.isPriority,
      dataset: {
        label: account.name,
        data: generateAccountData(account, accountListTransactions, dates),
        fill: true,
        backgroundColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},0.2)`,
        borderColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},1)`,
      },
    };
  });
};

export type IndividualTransaction = {
  name: string;
  amount: number;
  date: string;
  id: string;
  transactionType: 'debit' | 'credit';
  accountId: string;
};

/**
 * Lists individual transactions within a given date range based on the frequency.
 * It does not include transactions that have been paid.
 *
 * @param {Date} dateEnd - The end date of the range.
 * @param {Transaction} transaction - The transaction object.
 * @returns {IndividualTransaction[]} An array of individual transactions within the specified date range.
 */
export const listIndividualTransactions = (
  dateEnd: Date,
  transaction: Transaction
): IndividualTransaction[] => {
  const result: IndividualTransaction[] = [];

  let currentDate = new Date(transaction.startDate);
  const originalDate = new Date(transaction.startDate);

  //Checks to see if endDate has been set for the transaction, if the transactions dateEnd is shorter than the supplied time range the earlier dateEnd is used.
  if (transaction.endDate && new Date(transaction.endDate) < dateEnd) {
    dateEnd = new Date(transaction.endDate);
  }

  let monthCount = 0; // Is used when the frequency is set to monthly
  let breakLoop = false;
  while (currentDate.getTime() <= dateEnd.getTime()) {
    if (breakLoop) break;
    monthCount++;

    const currentDateString = convertDateToString(currentDate);

    if (!transaction.paidDates.some(date => date === currentDateString)) {
      result.push({
        name: transaction.name,
        amount: Number(transaction.amount),
        date: convertDateToString(currentDate),
        id: transaction.id,
        transactionType: transaction.transactionType,
        accountId: transaction.accountId,
      });
    }

    switch (transaction.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate = addMonths(originalDate, monthCount);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      case 'once':
        breakLoop = true;
        break;
      default:
        break;
    }
  }

  return result;
};

/**
 * Generates all of the transactions for each currency for a given time range.
 * It does not include transactions that have been paid.
 *
 * @param {Transaction[]} transactions - The transactions as stored in the DB
 * @param {Account[]} accounts - The accounts as store in the DB.
 * @param {Date} dateEnd - The target date.
 * @returns {IndividualTransaction} An individual transactions array as the value.
 */
export const createTransactions = (
  transactions: Transaction[],
  accounts: Account[],
  dateEnd: Date
): IndividualTransaction[] => {
  //find all transactions by account
  const accountTransactions = transactions.filter(transaction =>
    accounts.some(account => transaction.accountId === account.id)
  );
  //work out accountTransactions by date within the timeframe
  return accountTransactions
    .reduce<IndividualTransaction[]>((acc, individualTransaction) => {
      acc = acc.concat(
        listIndividualTransactions(dateEnd, individualTransaction)
      );
      return acc;
    }, [])
    .sort((a, b) => {
      return a.date.localeCompare(b.date);
    });
};

export const totalDatasets = (labels: Date[], datasets: GeneratedDataset[]) => {
  const initialTotals = new Array(labels.length).fill(0);

  return datasets.reduce<number[]>((acc, dataset) => {
    dataset.dataset.data.forEach((dataPoint, index) => {
      if (!dataPoint) return;
      if (typeof dataPoint !== 'number') return;
      acc[index] += dataPoint;
      return acc;
    });
    return acc;
  }, initialTotals);
};

export type EnhancedTarget = {
  balanceBegin: number;
  balanceDisposable: number;
  balanceEnd: number;
  cashPerDay: number;
  dateBegin: Date;
  dateEnd: Date;
  days: number;
  name: string;
  totalCredit: number;
  totalDebit: number;
  transactions: IndividualTransaction[];
  dataset: number[];
  id?: string;
};

export type EnhancedTargets = {
  _id: string;
  total: EnhancedTarget;
  accounts: EnhancedTarget[];
};

type TotalTransactions = {
  totalCredit: number;
  totalDebit: number;
};

const totalTransactions = (
  transactions: IndividualTransaction[]
): TotalTransactions => {
  return transactions.reduce<TotalTransactions>(
    (acc, transaction) => {
      if (transaction.transactionType === 'credit') {
        acc.totalCredit += Number(transaction.amount);
      } else {
        acc.totalDebit += Number(transaction.amount);
      }
      return acc;
    },
    {
      totalDebit: 0,
      totalCredit: 0,
    }
  );
};

export const enhanceTargets = (
  targets: Target[],
  accounts: Account[],
  accountTotals: AccountTotals,
  transactions: Transaction[]
): EnhancedTargets[] => {
  const result: EnhancedTargets[] = [];

  //remove all targets that have expired
  const validTargets = targets.filter(
    target =>
      new Date(target.dateEnd) >= new Date(convertDateToString(new Date()))
  );

  const finalDateEnd = validTargets.reduce((acc, {dateEnd}) => {
    if (new Date(dateEnd) > acc) acc = new Date(dateEnd);
    return acc;
  }, new Date());

  //generates all the transactions for all currencies
  const individualTransactions = createTransactions(
    transactions,
    accounts,
    finalDateEnd
  );

  const calc = (
    targetIndex: number,
    individualTransactions: IndividualTransaction[],
    dateEnd: Date,
    targets: Target[],
    balanceEnd: number,
    name: string,
    accountTotals: AccountTotals,
    result: EnhancedTargets[],
    accountInfo?: {
      accountIndex: number;
      accountId: string;
      isPriority: boolean;
      cashPerDay: number;
      balance: number;
    }
  ): EnhancedTarget => {
    let balanceBegin = 0;
    let tempTransactions: IndividualTransaction[] = [];
    let dateBegin = new Date();

    if (!targetIndex) {
      if (accountInfo) {
        balanceBegin = Number(accountInfo.balance);
      } else {
        balanceBegin = accountTotals.total.onlyCalculated;
      }

      tempTransactions = individualTransactions.filter(
        ({date}) => new Date(date) <= dateEnd
      );
    } else {
      if (accountInfo) {
        balanceBegin =
          result[result.length - 1].accounts[accountInfo.accountIndex]
            .balanceEnd;
      } else {
        balanceBegin = Number(targets[targetIndex - 1].balanceEnd);
      }
      dateBegin = new Date(targets[targetIndex - 1].dateEnd);
      dateBegin.setDate(dateBegin.getDate() + 1);
      tempTransactions = individualTransactions.filter(
        ({date}) => new Date(date) >= dateBegin && new Date(date) <= dateEnd
      );
    }

    if (accountInfo) {
      tempTransactions = tempTransactions.filter(
        transaction => transaction.accountId === accountInfo.accountId
      );
    }

    // Get the duration of the target in days (inclusive)
    const dateDifference = new Date(dateEnd).getTime() - dateBegin.getTime();
    const days = Math.ceil(dateDifference / (1000 * 3600 * 24)) + 1;

    const {totalCredit, totalDebit} = totalTransactions(tempTransactions);

    const dates = generateLabels(dateEnd, dateBegin);

    let balanceDisposable = 0;
    let cashPerDay = 0;
    if (accountInfo) {
      cashPerDay = accountInfo.isPriority ? accountInfo.cashPerDay : 0;
      balanceDisposable = cashPerDay * days;
      balanceEnd = balanceBegin + totalCredit - totalDebit - balanceDisposable;
    } else {
      balanceDisposable = balanceBegin + totalCredit - totalDebit - balanceEnd;
      cashPerDay = balanceDisposable / days;
    }

    let balanceRunning = balanceBegin;
    const dataset = dates.map((date, index) => {
      const amount = tempTransactions
        .filter(transaction => {
          if (!index) {
            //on the first date, it looks to see if anything older has not been paid yet
            return (
              new Date(transaction.date).getTime() <=
              new Date(convertDateToString(date)).getTime()
            );
          } else {
            return transaction.date === convertDateToString(date);
          }
        })
        .reduce((acc, transaction) => {
          if (transaction.transactionType === 'debit') {
            acc += Number(transaction.amount);
          } else {
            acc -= Number(transaction.amount);
          }
          return acc;
        }, 0);

      balanceRunning -= amount + cashPerDay;
      return balanceRunning;
    });

    return {
      balanceBegin,
      balanceDisposable,
      balanceEnd,
      cashPerDay,
      dateBegin,
      dateEnd,
      days,
      name,
      totalCredit,
      totalDebit,
      transactions: tempTransactions,
      dataset,
      id: accountInfo ? accountInfo.accountId : '',
    };
  };

  validTargets
    .sort(
      //from oldest to newest
      (a, b) => new Date(a.dateEnd).getTime() - new Date(b.dateEnd).getTime()
    )
    .forEach((target, targetIndex) => {
      const {_id} = target;
      const balanceEnd = Number(target.balanceEnd);
      const dateEnd = new Date(target.dateEnd);
      const total = calc(
        targetIndex,
        individualTransactions,
        dateEnd,
        validTargets,
        balanceEnd,
        'Total',
        accountTotals,
        result
      );

      const accountsArray: EnhancedTarget[] = accounts.map(
        ({name, id, isPriority, balance}, accountIndex) => {
          return calc(
            targetIndex,
            individualTransactions,
            dateEnd,
            validTargets,
            balanceEnd,
            name,
            accountTotals,
            result,
            {
              accountIndex,
              accountId: id,
              isPriority,
              cashPerDay: total.cashPerDay,
              balance: Number(balance),
            }
          );
        }
      );
      result.push({
        _id,
        total,
        accounts: accountsArray,
      });
    });

  return result;
};
