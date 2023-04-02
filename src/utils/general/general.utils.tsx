import {Account, Transaction} from '../../store/user/user.types';
import {addMonths} from 'date-fns';
import {ChartDataset, Point} from 'chart.js';

export const convertDateToString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T')[0];
};

export const generateLabels = (targetDate: Date) => {
  const today = new Date(convertDateToString(new Date()));
  const labels = [];
  for (let i = today; i <= targetDate; i.setDate(i.getDate() + 1)) {
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
    : null;
}

export const generateDatasets = (
  dates: Date[],
  accounts: Account[],
  transactions: Transaction[]
): ChartDataset<'line', (number | Point | null)[]>[] => {
  return accounts.map(account => {
    //find all transactions by account
    const accountTransactions = transactions.filter(
      transaction => transaction.accountId === account.id
    );
    //work out acountTransactions by date within the timeframe
    const accountListTransactions = accountTransactions.reduce<
      ListedTransaction[]
    >((acc, accountTransaction) => {
      acc = acc.concat(
        listTransactions(dates[0], dates[dates.length - 1], accountTransaction)
      );
      return acc;
    }, []);

    let balance = account.balance;
    const accountData = dates.map((date, index) => {
      const amount = accountListTransactions
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

    const result = hexToRgb(account.color);

    return {
      label: account.name,
      data: accountData,
      fill: true,
      backgroundColor: `rgba(${result?.r},${result?.g},${result?.b},0.2)`,
      borderColor: `rgba(${result?.r},${result?.g},${result?.b},1)`,
    };
  });
};

type ListedTransaction = {
  amount: number;
  date: string;
  id: string;
  transactionType: 'debit' | 'credit';
  accountId: string;
};

export const listTransactions = (
  startDate: Date,
  endDate: Date,
  transaction: Transaction
) => {
  const result: ListedTransaction[] = [];

  let currentDate = new Date(transaction.startDate);
  const originalDate = new Date(transaction.startDate);

  if (transaction.endDate && new Date(transaction.endDate) < endDate) {
    endDate = new Date(transaction.endDate);
  }

  let monthCount = 0;
  let breakLoop = false;
  while (currentDate.getTime() <= endDate.getTime()) {
    if (breakLoop) break;
    monthCount++;

    const currentDateString = convertDateToString(currentDate);

    if (!transaction.paidDates.some(date => date === currentDateString)) {
      result.push({
        amount: transaction.amount,
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
