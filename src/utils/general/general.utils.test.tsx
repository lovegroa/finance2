import {Account, Transaction, UserType} from '../../store/user/user.types';
import {generateDatasets, listTransactions} from './general.utils';
// eslint-disable-next-line node/no-unpublished-import
import {describe, it, expect} from 'vitest';

describe('listTransactions', () => {
  const transaction: UserType['transactions'][0] = {
    id: '1',
    transactionType: 'debit',
    accountId: 'A',
    frequency: 'once',
    name: 'test',
    createdDate: '2017-03-22',
    startDate: '2023-03-31',
    amount: 1000,
    paidDates: [''],
  };

  it('should return an empty array when the start date is after the end date', () => {
    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2023-01-01'),
      transaction
    );
    expect(result).toEqual([]);
  });

  it('should return an array with one transaction when the frequency is "once"', () => {
    const result = listTransactions(
      new Date('2023-03-30'),
      new Date('2023-04-30'),
      transaction
    );
    expect(result).toEqual([
      {
        amount: 1000,
        date: '2023-03-31',
        id: '1',
        transactionType: 'debit',
        accountId: 'A',
      },
    ]);
  });

  it('should return an array of monthly transactions', () => {
    transaction.frequency = 'monthly';
    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2024-01-31'),
      transaction
    );
    expect(result.length).toEqual(11);
    expect(result[0]).toEqual({
      amount: 1000,
      date: '2023-03-31',
      id: '1',
      transactionType: 'debit',
      accountId: 'A',
    });
    expect(result[1]).toEqual({
      amount: 1000,
      date: '2023-04-30',
      id: '1',
      transactionType: 'debit',
      accountId: 'A',
    });
  });
  it('should return a shorter array of transactions if the end date of the transaction falls sooner than the target end date', () => {
    transaction.endDate = '2023-06-30';
    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2024-01-31'),
      transaction
    );
    expect(result.length).toEqual(4);
  });
  it('should return an array of daily transactions', () => {
    transaction.frequency = 'daily';
    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2023-04-30'),
      transaction
    );
    expect(result.length).toEqual(31);
  });
  it('should return an array of weekly transactions', () => {
    transaction.frequency = 'weekly';
    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2023-04-30'),
      transaction
    );
    expect(result.length).toEqual(5);
  });

  it('should return an array of yearly transactions', () => {
    transaction.frequency = 'yearly';
    transaction.endDate = '2024-06-30';

    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2024-04-30'),
      transaction
    );
    expect(result.length).toEqual(2);
  });

  it('should return an array of one transaction', () => {
    transaction.frequency = 'once';
    transaction.endDate = '2024-06-30';

    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2024-04-30'),
      transaction
    );
    expect(result.length).toEqual(1);
  });

  it('should skip transactions that have been marked as paid', () => {
    transaction.frequency = 'yearly';
    transaction.endDate = '2024-06-30';
    transaction.paidDates.push('2024-03-31');

    const result = listTransactions(
      new Date('2023-03-31'),
      new Date('2024-04-30'),
      transaction
    );
    expect(result.length).toEqual(1);
  });
});

describe('generateDatasets', () => {
  const transactions: Transaction[] = [
    {
      createdDate: 'Fri Mar 31 2023 07:59:18 GMT+0900 (Japan Standard Time)',
      amount: 1,
      frequency: 'daily',
      startDate: '2023-03-31',
      endDate: '2023-04-30',
      transactionType: 'debit',
      accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
      paidDates: ['2023-03-31', '2023-04-01', '2023-04-02'],
      name: 'rent',
      id: '3ca6c1a8-fbcf-4e90-9a6e-49c0806056b8',
    },
    {
      createdDate: 'Fri Mar 31 2023 07:59:18 GMT+0900 (Japan Standard Time)',
      amount: 10,
      frequency: 'once',
      startDate: '2023-04-05',
      transactionType: 'credit',
      accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
      paidDates: [],
      name: 'rent',
      id: '3ca6c1a8-fbcf-4e90-9a6e-49c0806056b8',
    },
  ];

  const accounts: Account[] = [
    {
      accountType: 'debit',
      color: '#000000',
      balance: 1000,
      isPriority: true,
      name: 'Monzo',
      createdDate: 'Thu Mar 30 2023 21:46:35 GMT+0900 (Japan Standard Time)',
      includeInCalculations: true,
      id: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
      currency: 'GBP',
      balanceLimit: 0,
    },
  ];

  const dates: Date[] = [];

  const startDate = new Date('2023-04-01');
  const endDate = new Date('2023-04-08');

  for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    dates.push(new Date(i));
  }

  it('should return an empty array when the start date is after the end date', () => {
    const result = generateDatasets(dates, accounts, transactions);
    expect(result).toEqual([
      {
        label: 'Monzo',
        data: [1000, 1000, 999, 998, 1007, 1006, 1005, 1004],
        fill: true,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderColor: 'rgba(0,0,0,1)',
      },
    ]);
  });
});
