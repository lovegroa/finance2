/* eslint-disable node/no-unpublished-import */
import {describe, it, expect} from 'vitest';
import {listIndividualTransactions} from './general.utils';
import {Transaction} from '../../store/user/user.types';
describe('List transactions', () => {
  it('If the frequency is once, it should return one transaction', () => {
    const transaction: Transaction = {
      transactionType: 'debit',
      accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
      createdDate: 'Sun Jun 11 2023 09:18:13 GMT+0900 (Japan Standard Time)',
      startDate: '2023-06-15',
      frequency: 'once',
      amount: '5000',
      id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
      name: 'test',
      noEndDate: false,
      endDate: '2023-06-15',
      paidDates: [],
    };

    const result = listIndividualTransactions(
      new Date('2023-06-24'),
      transaction
    );
    expect(result).toEqual([
      {
        accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
        amount: 5000,
        date: '2023-06-15',
        id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
        name: 'test',
        transactionType: 'debit',
      },
    ]);
  });
  it('If the endDate is not set, it should do all dates until and including the end', () => {
    const transaction: Transaction = {
      transactionType: 'debit',
      accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
      createdDate: 'Sun Jun 11 2023 09:18:13 GMT+0900 (Japan Standard Time)',
      startDate: '2023-06-15',
      frequency: 'daily',
      amount: '5000',
      id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
      name: 'test',
      noEndDate: false,
      endDate: undefined,
      paidDates: [],
    };

    const result = listIndividualTransactions(
      new Date('2023-06-17'),
      transaction
    );
    expect(result).toEqual([
      {
        name: 'test',
        amount: 5000,
        date: '2023-06-15',
        id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
        transactionType: 'debit',
        accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
      },
      {
        name: 'test',
        amount: 5000,
        date: '2023-06-16',
        id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
        transactionType: 'debit',
        accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
      },
      {
        name: 'test',
        amount: 5000,
        date: '2023-06-17',
        id: 'c8cd19bb-f795-472b-ab4f-5b64ba24d26e',
        transactionType: 'debit',
        accountId: '5a5e201c-0385-433c-aed7-fb3885f43ccd',
      },
    ]);
  });
});

// import {AccountTotals} from '../../store/user/user.slice';
// import {
//   Account,
//   Currency,
//   Target,
//   Transaction,
//   UserType,
// } from '../../store/user/user.types';
// import {
//   enhanceTargets,
//   generateDatasets,
//   listIndividualTransactions,
// } from './general.utils';
// // eslint-disable-next-line node/no-unpublished-import
// import {describe, it, expect} from 'vitest';

// describe('listTransactions', () => {
//   const transaction: UserType['transactions'][0] = {
//     id: '1',
//     transactionType: 'debit',
//     accountId: 'A',
//     frequency: 'once',
//     name: 'test',
//     createdDate: '2017-03-22',
//     startDate: '2023-03-31',
//     amount: '1000',
//     paidDates: [''],
//   };

//   it('should return an empty array when the start date is after the end date', () => {
//     const result = listIndividualTransactions(
//       new Date('2023-01-01'),
//       transaction
//     );
//     expect(result).toEqual([]);
//   });

//   it.skip('should return an array with one transaction when the frequency is "once"', () => {
//     const result = listIndividualTransactions(
//       new Date('2023-04-30'),
//       transaction
//     );
//     expect(result).toEqual([
//       {
//         amount: 1000,
//         date: '2023-03-31',
//         id: '1',
//         transactionType: 'debit',
//         accountId: 'A',
//       },
//     ]);
//   });

//   it.skip('should return an array of monthly transactions', () => {
//     transaction.frequency = 'monthly';
//     const result = listIndividualTransactions(
//       new Date('2024-01-31'),
//       transaction
//     );
//     expect(result.length).toEqual(11);
//     expect(result[0]).toEqual({
//       amount: 1000,
//       date: '2023-03-31',
//       id: '1',
//       transactionType: 'debit',
//       accountId: 'A',
//     });
//     expect(result[1]).toEqual({
//       amount: 1000,
//       date: '2023-04-30',
//       id: '1',
//       transactionType: 'debit',
//       accountId: 'A',
//     });
//   });
//   it.skip('should return a shorter array of transactions if the end date of the transaction falls sooner than the target end date', () => {
//     transaction.endDate = '2023-06-30';
//     const result = listIndividualTransactions(
//       new Date('2024-01-31'),
//       transaction
//     );
//     expect(result.length).toEqual(4);
//   });
//   it('should return an array of daily transactions', () => {
//     transaction.frequency = 'daily';
//     const result = listIndividualTransactions(
//       new Date('2023-04-30'),
//       transaction
//     );
//     expect(result.length).toEqual(31);
//   });
//   it('should return an array of weekly transactions', () => {
//     transaction.frequency = 'weekly';
//     const result = listIndividualTransactions(
//       new Date('2023-04-30'),
//       transaction
//     );
//     expect(result.length).toEqual(5);
//   });

//   it('should return an array of yearly transactions', () => {
//     transaction.frequency = 'yearly';
//     transaction.endDate = '2024-06-30';

//     const result = listIndividualTransactions(
//       new Date('2024-04-30'),
//       transaction
//     );
//     expect(result.length).toEqual(2);
//   });

//   it('should return an array of one transaction', () => {
//     transaction.frequency = 'once';
//     transaction.endDate = '2024-06-30';

//     const result = listIndividualTransactions(
//       new Date('2024-04-30'),
//       transaction
//     );
//     expect(result.length).toEqual(1);
//   });

//   it('should skip transactions that have been marked as paid', () => {
//     transaction.frequency = 'yearly';
//     transaction.endDate = '2024-06-30';
//     transaction.paidDates.push('2024-03-31');

//     const result = listIndividualTransactions(
//       new Date('2024-04-30'),
//       transaction
//     );
//     expect(result.length).toEqual(1);
//   });
// });

// describe('generateDatasets', () => {
//   const transactions: Transaction[] = [
//     {
//       createdDate: 'Fri Mar 31 2023 07:59:18 GMT+0900 (Japan Standard Time)',
//       amount: '1',
//       frequency: 'daily',
//       startDate: '2023-03-31',
//       endDate: '2023-04-30',
//       transactionType: 'debit',
//       accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//       paidDates: ['2023-03-31', '2023-04-01', '2023-04-02'],
//       name: 'rent',
//       id: '3ca6c1a8-fbcf-4e90-9a6e-49c0806056b8',
//     },
//     {
//       createdDate: 'Fri Mar 31 2023 07:59:18 GMT+0900 (Japan Standard Time)',
//       amount: '10',
//       frequency: 'once',
//       startDate: '2023-04-05',
//       transactionType: 'credit',
//       accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//       paidDates: [],
//       name: 'rent',
//       id: '3ca6c1a8-fbcf-4e90-9a6e-49c0806056b8',
//     },
//   ];

//   const accounts: Account[] = [
//     {
//       accountType: 'debit',
//       color: '#000000',
//       balance: '1000',
//       isPriority: true,
//       name: 'Monzo',
//       createdDate: 'Thu Mar 30 2023 21:46:35 GMT+0900 (Japan Standard Time)',
//       includeInCalculations: true,
//       id: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//       currency: 'GBP',
//       balanceLimit: '0',
//     },
//   ];

//   const dates: Date[] = [];

//   const startDate = new Date('2023-04-01');
//   const endDate = new Date('2023-04-08');

//   for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
//     dates.push(new Date(i));
//   }

//   it('should generate the dataset', () => {
//     const result = generateDatasets(dates, accounts, transactions);
//     expect(result).toEqual([
//       {
//         priority: true,
//         dataset: {
//           label: 'Monzo',
//           data: [1000, 1000, 999, 998, 1007, 1006, 1005, 1004],
//           fill: true,
//           backgroundColor: 'rgba(0,0,0,0.2)',
//           borderColor: 'rgba(0,0,0,1)',
//         },
//       },
//     ]);
//   });
// });

// describe('enhancedTargets', () => {
//   it('should remove targets that have expired', () => {
//     const targets: Target[] = [
//       {
//         _id: '1',
//         balanceEnd: '20',
//         currency: 'JPY',
//         dateCreated: '2020-03-03',
//         dateEnd: '2023-06-24',
//       },
//       {
//         _id: '1',
//         balanceEnd: '20',
//         currency: 'GBP',
//         dateCreated: '2020-03-03',
//         dateEnd: '2023-07-24',
//       },
//       {
//         _id: '1',
//         balanceEnd: '20',
//         currency: 'JPY',
//         dateCreated: '2020-03-03',
//         dateEnd: '2023-07-24',
//       },
//     ];
//     const usedCurrencies: Currency[] = ['JPY', 'GBP'];
//     const accountTotals: AccountTotals[] = [
//       {
//         currency: 'GBP',
//         debit: {
//           total: 3823.11,
//           onlyCalculated: 3823.11,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//         credit: {
//           total: 0,
//           onlyCalculated: 0,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//         total: {
//           total: 3823.11,
//           onlyCalculated: 3823.11,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//       },
//       {
//         currency: 'JPY',
//         debit: {
//           total: 440621,
//           onlyCalculated: 440621,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//         credit: {
//           total: 0,
//           onlyCalculated: 0,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//         total: {
//           total: 440621,
//           onlyCalculated: 440621,
//           totalLimit: 0,
//           onlyCalculatedLimit: 0,
//         },
//       },
//     ];
//     const accounts: Account[] = [
//       {
//         balance: '3152.02',
//         color: '#f24740',
//         currency: 'GBP',
//         name: 'Monzo Joint',
//         accountType: 'debit',
//         balanceLimit: '0',
//         isPriority: true,
//         id: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         includeInCalculations: true,
//         createdDate: 'Thu Mar 30 2023 21:46:35 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         name: 'Prestia',
//         includeInCalculations: true,
//         id: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         color: '#054939',
//         createdDate: 'Thu Mar 30 2023 21:46:35 GMT+0900 (Japan Standard Time)',
//         balance: '374964',
//         isPriority: false,
//         currency: 'JPY',
//         balanceLimit: '0',
//         accountType: 'debit',
//       },
//       {
//         currency: 'GBP',
//         balanceLimit: '0',
//         isPriority: false,
//         name: 'Monzo Current',
//         accountType: 'debit',
//         id: '1bbd08b6-c314-4da6-acca-7e9ce8e410fd',
//         createdDate: 'Mon Apr 03 2023 15:22:32 GMT+0900 (Japan Standard Time)',
//         includeInCalculations: true,
//         color: '#c8c8c8',
//         balance: '671.09',
//       },
//       {
//         includeInCalculations: true,
//         name: 'Cash',
//         createdDate: 'Sun May 07 2023 20:53:58 GMT+0900 (Japan Standard Time)',
//         id: 'b310dc72-825d-4739-b9cf-335bf31a7cdb',
//         isPriority: false,
//         balance: '0',
//         balanceLimit: '0',
//         currency: 'JPY',
//         color: '#ffd700',
//         accountType: 'debit',
//       },
//       {
//         currency: 'JPY',
//         accountType: 'debit',
//         id: '4bcbc459-ac8b-488f-aafa-0386f1d0008d',
//         createdDate: 'Sun May 07 2023 20:53:58 GMT+0900 (Japan Standard Time)',
//         balanceLimit: '0',
//         isPriority: false,
//         name: 'Pasmo',
//         includeInCalculations: true,
//         color: '#ea6da4',
//         balance: '1000',
//       },
//       {
//         name: 'Revolut',
//         includeInCalculations: true,
//         balanceLimit: '0',
//         balance: '64657',
//         currency: 'JPY',
//         accountType: 'debit',
//         isPriority: true,
//         createdDate: 'Sun Jun 04 2023 07:55:26 GMT+0900 (Japan Standard Time)',
//         id: '8ce0e2eb-0c98-454a-a824-a5e88abea4d3',
//         color: '#000000',
//       },
//     ];

//     const transactions: Transaction[] = [
//       {
//         startDate: '2023-03-30',
//         endDate: '2024-02-28',
//         name: 'Health Insurance',
//         paidDates: ['2023-03-30', '2023-04-30'],
//         transactionType: 'debit',
//         frequency: 'monthly',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         id: 'a4570116-78ec-47fa-a568-cd838ecb026c',
//         createdDate: 'Thu Mar 30 2023 22:37:15 GMT+0900 (Japan Standard Time)',
//         amount: '2750',
//       },
//       {
//         paidDates: ['2023-04-25', '2023-05-25'],
//         transactionType: 'credit',
//         amount: '793318',
//         createdDate: 'Fri Mar 31 2023 08:00:07 GMT+0900 (Japan Standard Time)',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         startDate: '2023-04-25',
//         name: 'Salary',
//         endDate: '2024-04-30',
//         id: 'b98dbda8-79b2-448e-837a-fec69c9ff236',
//         frequency: 'monthly',
//       },
//       {
//         paidDates: ['2023-05-25'],
//         startDate: '2023-05-25',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         transactionType: 'debit',
//         endDate: '2024-03-25',
//         id: 'bf56a184-c6d5-4756-90c1-4e67ead57a25',
//         amount: '191620',
//         frequency: 'monthly',
//         name: 'Rent',
//         createdDate: 'Sun Apr 02 2023 20:09:29 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         name: 'First Rent',
//         amount: '90130',
//         frequency: 'once',
//         startDate: '2023-04-25',
//         paidDates: ['2023-04-25'],
//         transactionType: 'debit',
//         id: '57847587-162a-45ec-8f82-9d40f6097e50',
//         createdDate: 'Sun Apr 02 2023 20:11:53 GMT+0900 (Japan Standard Time)',
//         endDate: '2023-04-25',
//       },
//       {
//         paidDates: [],
//         name: 'Last Rent',
//         endDate: '2024-04-25',
//         createdDate: 'Sun Apr 02 2023 20:13:49 GMT+0900 (Japan Standard Time)',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         frequency: 'once',
//         startDate: '2024-04-25',
//         id: '3c85a6f7-0087-48b6-875f-622bd08a7989',
//         amount: '108585',
//         transactionType: 'debit',
//       },
//       {
//         startDate: '2023-04-25',
//         createdDate: 'Sun Apr 02 2023 20:15:27 GMT+0900 (Japan Standard Time)',
//         frequency: 'monthly',
//         endDate: '2023-06-25',
//         paidDates: ['2023-04-25', '2023-05-25'],
//         transactionType: 'debit',
//         id: '8679ba23-25b8-40d6-b750-3765e1603fd1',
//         amount: '60000',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         name: 'Deposit',
//       },
//       {
//         startDate: '2023-04-25',
//         name: 'Initial Costs',
//         endDate: '2023-06-25',
//         frequency: 'monthly',
//         amount: '91500',
//         transactionType: 'debit',
//         paidDates: ['2023-04-25', '2023-05-25'],
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         id: '98fda874-ed80-47c1-8dcf-592e11995861',
//         createdDate: 'Sun Apr 02 2023 20:16:02 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         startDate: '2023-05-25',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         id: 'e652d520-2669-4586-9b9b-5e1227d70142',
//         paidDates: ['2023-05-25'],
//         frequency: 'monthly',
//         createdDate: 'Sun Apr 02 2023 20:19:34 GMT+0900 (Japan Standard Time)',
//         transactionType: 'debit',
//         endDate: '2024-04-24',
//         amount: '375000',
//         name: 'Send money home',
//       },
//       {
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         name: 'Furniture',
//         createdDate: 'Sun Apr 02 2023 21:39:35 GMT+0900 (Japan Standard Time)',
//         amount: '0',
//         frequency: 'once',
//         startDate: '2023-04-04',
//         endDate: '2023-04-21',
//         paidDates: ['2023-04-04'],
//         id: '3f92ba16-1216-448d-9772-89b9dd954f94',
//         transactionType: 'debit',
//       },
//       {
//         paidDates: ['2023-05-25'],
//         frequency: 'once',
//         createdDate: 'Mon Apr 03 2023 14:39:11 GMT+0900 (Japan Standard Time)',
//         name: 'Furniture Credit',
//         id: '498cbae9-b42e-45f8-8839-1f831c73eea5',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         amount: '500000',
//         transactionType: 'credit',
//         startDate: '2023-05-25',
//         endDate: '2023-05-25',
//       },
//       {
//         name: 'Audible',
//         accountId: '1bbd08b6-c314-4da6-acca-7e9ce8e410fd',
//         frequency: 'monthly',
//         endDate: '2024-12-03',
//         id: '255ffb42-39d4-4a7b-a9cc-eb40abece44b',
//         startDate: '2023-04-16',
//         transactionType: 'debit',
//         createdDate: 'Mon Apr 03 2023 15:51:02 GMT+0900 (Japan Standard Time)',
//         amount: '7.99',
//         paidDates: ['2023-04-16'],
//       },
//       {
//         id: 'fbaceeb8-614c-4baf-9df6-b7882d0610eb',
//         amount: '22.84',
//         createdDate: 'Mon Apr 03 2023 15:52:38 GMT+0900 (Japan Standard Time)',
//         accountId: '1bbd08b6-c314-4da6-acca-7e9ce8e410fd',
//         name: 'Phone (Klarna)',
//         frequency: 'monthly',
//         transactionType: 'debit',
//         endDate: '2024-03-03',
//         paidDates: ['2023-04-03', '2023-05-03'],
//         startDate: '2023-04-03',
//       },
//       {
//         amount: '11.42',
//         endDate: '2024-04-16',
//         accountId: '1bbd08b6-c314-4da6-acca-7e9ce8e410fd',
//         id: '0e665f1f-b3a0-4f3b-ac25-afeb1b3c8c0b',
//         createdDate: 'Mon Apr 03 2023 15:53:42 GMT+0900 (Japan Standard Time)',
//         frequency: 'monthly',
//         transactionType: 'debit',
//         startDate: '2023-04-13',
//         paidDates: ['2023-04-13', '2023-05-13'],
//         name: 'EE',
//       },
//       {
//         startDate: '2023-05-01',
//         createdDate: 'Mon Apr 03 2023 15:57:54 GMT+0900 (Japan Standard Time)',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         transactionType: 'debit',
//         amount: '233.45',
//         paidDates: ['2023-05-01'],
//         frequency: 'monthly',
//         endDate: '2024-12-03',
//         name: 'Octopus Energy',
//         id: '2d00d541-9e48-461c-9ce5-e997b36f8065',
//       },
//       {
//         amount: '26',
//         createdDate: 'Mon Apr 03 2023 15:59:17 GMT+0900 (Japan Standard Time)',
//         transactionType: 'debit',
//         endDate: '2024-08-23',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         frequency: 'monthly',
//         paidDates: ['2023-05-01'],
//         name: 'Thames Water',
//         startDate: '2023-05-01',
//         id: '9f419b57-e457-48bb-94bf-072f27ea3e86',
//       },
//       {
//         startDate: '2023-05-01',
//         amount: '154',
//         createdDate: 'Mon Apr 03 2023 15:59:54 GMT+0900 (Japan Standard Time)',
//         transactionType: 'debit',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         id: 'c4b4cb52-9b50-4297-9ea0-5da66729919f',
//         paidDates: ['2023-05-01'],
//         frequency: 'monthly',
//         endDate: '2024-08-31',
//         name: 'Council Tax',
//       },
//       {
//         id: 'a9d79190-5df5-4c9d-9234-91ab975a7feb',
//         startDate: '2023-05-01',
//         amount: '13.25',
//         paidDates: ['2023-05-01'],
//         name: 'TV Licensing',
//         createdDate: 'Mon Apr 03 2023 16:01:56 GMT+0900 (Japan Standard Time)',
//         endDate: '2024-07-11',
//         transactionType: 'debit',
//         frequency: 'monthly',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//       },
//       {
//         paidDates: ['2023-04-03', '2023-05-03'],
//         amount: '364.59',
//         endDate: '2023-12-03',
//         frequency: 'monthly',
//         transactionType: 'debit',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         id: 'b9fcbe61-6992-431b-984a-2de82d7c7b1d',
//         name: 'GA Stripe',
//         startDate: '2023-04-03',
//         createdDate: 'Mon Apr 03 2023 16:03:09 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         endDate: '2024-06-22',
//         frequency: 'monthly',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         id: '40a58dd4-198a-4efe-80ea-2b4f5cabecbd',
//         amount: '30',
//         createdDate: 'Mon Apr 03 2023 16:05:10 GMT+0900 (Japan Standard Time)',
//         transactionType: 'debit',
//         name: 'Virgin Media',
//         paidDates: ['2023-04-13'],
//         startDate: '2023-04-13',
//       },
//       {
//         paidDates: ['2023-04-20'],
//         frequency: 'monthly',
//         id: '14b98e6f-5d13-49a0-8e6b-704be3904bef',
//         name: 'Admiral',
//         transactionType: 'debit',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         amount: '36.21',
//         startDate: '2023-04-20',
//         endDate: '2024-07-31',
//         createdDate: 'Mon Apr 03 2023 16:05:59 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         createdDate: 'Mon Apr 03 2023 16:07:07 GMT+0900 (Japan Standard Time)',
//         paidDates: ['2023-04-16'],
//         endDate: '2024-07-24',
//         startDate: '2023-04-16',
//         transactionType: 'debit',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         frequency: 'monthly',
//         amount: '10.99',
//         id: '77683227-f4ba-4c47-8254-9d97f0e70839',
//         name: 'Netflix',
//       },
//       {
//         endDate: '2024-08-24',
//         amount: '1567.6',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         id: '8a733a7b-2a39-46f4-a015-af713e125b51',
//         createdDate: 'Mon Apr 03 2023 16:07:54 GMT+0900 (Japan Standard Time)',
//         paidDates: ['2023-05-01'],
//         name: 'HSBC Mortgage 1',
//         startDate: '2023-05-01',
//         transactionType: 'debit',
//         frequency: 'monthly',
//       },
//       {
//         createdDate: 'Mon Apr 03 2023 16:08:50 GMT+0900 (Japan Standard Time)',
//         endDate: '2024-11-30',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         paidDates: ['2023-05-01'],
//         name: 'HSBC Mortgage 2',
//         id: 'c9e7b6ee-51d6-4928-a235-e6c8c71d6857',
//         amount: '68.43',
//         transactionType: 'debit',
//         startDate: '2023-05-01',
//         frequency: 'monthly',
//       },
//       {
//         endDate: '2024-02-01',
//         amount: '695.16',
//         frequency: 'monthly',
//         paidDates: ['2023-04-01', '2023-05-01'],
//         id: '99aabd49-c8c4-4ac0-90a7-83f895a40851',
//         transactionType: 'credit',
//         startDate: '2023-04-01',
//         createdDate: 'Mon Apr 03 2023 16:10:06 GMT+0900 (Japan Standard Time)',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         name: 'Rochelle & Jamie',
//       },
//       {
//         endDate: '2024-04-24',
//         frequency: 'monthly',
//         amount: '2100',
//         id: '96a6ec88-2b88-45f1-9934-d68ea353cb31',
//         paidDates: [],
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         transactionType: 'credit',
//         createdDate: 'Mon Apr 03 2023 16:14:09 GMT+0900 (Japan Standard Time)',
//         startDate: '2023-05-26',
//         name: 'Money Sent Home',
//       },
//       {
//         endDate: '2023-06-25',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         createdDate: 'Mon Apr 24 2023 16:28:24 GMT+0900 (Japan Standard Time)',
//         name: 'Alex Paycheck',
//         amount: '225000',
//         transactionType: 'credit',
//         id: 'ccc3b3e4-10aa-4b1b-b13c-1b1cef870d77',
//         frequency: 'monthly',
//         paidDates: ['2023-05-25'],
//         startDate: '2023-05-25',
//       },
//       {
//         endDate: '2024-04-25',
//         transactionType: 'credit',
//         createdDate: 'Mon Apr 24 2023 16:33:32 GMT+0900 (Japan Standard Time)',
//         id: '36336dcd-806b-4657-9f44-00af605adabe',
//         amount: '268148',
//         name: "Alex's Paycheck",
//         startDate: '2023-07-25',
//         paidDates: [],
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         frequency: 'monthly',
//       },
//       {
//         name: 'Alex Residence Tax',
//         endDate: '2024-04-01',
//         transactionType: 'debit',
//         amount: '0',
//         id: '955c848e-bc27-4803-b9ee-5b659bb64062',
//         frequency: 'once',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         startDate: '2024-04-01',
//         createdDate: 'Mon Apr 24 2023 16:36:14 GMT+0900 (Japan Standard Time)',
//         paidDates: [],
//       },
//       {
//         frequency: 'once',
//         transactionType: 'debit',
//         startDate: '2024-04-01',
//         id: 'e4ee38ce-1db8-4eda-b113-06d7ef1c7ace',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         endDate: '2024-04-01',
//         amount: '0',
//         createdDate: 'Mon Apr 24 2023 16:37:14 GMT+0900 (Japan Standard Time)',
//         name: 'Suki Residence Tax',
//         paidDates: [],
//       },
//       {
//         createdDate: 'Mon Apr 24 2023 16:40:14 GMT+0900 (Japan Standard Time)',
//         id: '2267846f-7a21-4aa5-b502-c87c25c7203d',
//         amount: '500',
//         endDate: '2024-05-31',
//         frequency: 'monthly',
//         name: 'Student Loan Repayments',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         transactionType: 'debit',
//         paidDates: [],
//         startDate: '2023-05-31',
//       },
//       {
//         paidDates: [],
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         amount: '30000',
//         frequency: 'monthly',
//         transactionType: 'debit',
//         name: 'Bills',
//         endDate: '2024-05-22',
//         id: '4a68782f-a898-41e8-bbfb-8c8b803ee2e6',
//         createdDate: 'Mon Apr 24 2023 16:47:14 GMT+0900 (Japan Standard Time)',
//         startDate: '2023-05-01',
//       },
//       {
//         paidDates: ['2023-05-02'],
//         id: '45372658-b7f5-4841-adce-3557b4d42f29',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         endDate: '2023-07-14',
//         name: 'Emem Money',
//         frequency: 'once',
//         transactionType: 'debit',
//         amount: '100000',
//         startDate: '2023-05-02',
//         createdDate: 'Sun Apr 30 2023 10:28:56 GMT+0900 (Japan Standard Time)',
//       },
//       {
//         transactionType: 'debit',
//         startDate: '2023-05-01',
//         createdDate: 'Sun Apr 30 2023 10:30:16 GMT+0900 (Japan Standard Time)',
//         endDate: '2023-05-01',
//         id: '72094096-76a1-4cd1-a766-64c3964374c8',
//         name: 'Mum Money',
//         amount: '30000',
//         frequency: 'once',
//         paidDates: ['2023-05-01'],
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//       },
//       {
//         amount: '100000',
//         name: 'Suki Savings',
//         frequency: 'monthly',
//         createdDate: 'Sun May 07 2023 21:04:56 GMT+0900 (Japan Standard Time)',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         transactionType: 'debit',
//         paidDates: ['2023-05-26', '2023-04-26', '2023-03-26'],
//         startDate: '2023-03-26',
//         id: '4dedda0e-a0ea-406f-bc78-d877ca0435fb',
//         endDate: '2024-04-30',
//       },
//       {
//         frequency: 'monthly',
//         name: 'Alex Savings',
//         startDate: '2023-06-26',
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         amount: '25000',
//         paidDates: [],
//         transactionType: 'debit',
//         id: 'efda6c35-9d7b-4627-a109-bf5b2e07c2a0',
//         createdDate: 'Sun May 07 2023 21:08:58 GMT+0900 (Japan Standard Time)',
//         endDate: '2024-04-30',
//       },
//       {
//         transactionType: 'debit',
//         createdDate: 'Sun May 07 2023 21:20:24 GMT+0900 (Japan Standard Time)',
//         frequency: 'monthly',
//         name: 'Chat GPT',
//         amount: '19.22',
//         paidDates: ['2023-05-02'],
//         id: '18a3bf63-7d8a-4c2f-8fc9-0f7cfe41df05',
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         startDate: '2023-05-02',
//         endDate: '2024-05-31',
//       },
//       {
//         transactionType: 'debit',
//         createdDate: 'Sun May 07 2023 21:24:24 GMT+0900 (Japan Standard Time)',
//         amount: '19.7',
//         id: 'd75c5e08-ac92-4c1c-8fc9-ca7219785a72',
//         endDate: '2024-06-30',
//         paidDates: ['2023-05-02'],
//         accountId: '2befffa9-4d18-43b3-9165-0f03f2a37f45',
//         startDate: '2023-05-02',
//         name: 'Mobal',
//         frequency: 'monthly',
//       },
//       {
//         frequency: 'once',
//         endDate: '2023-06-11',
//         paidDates: [],
//         accountId: '84d3e402-c015-4f63-b1db-6498e69ec174',
//         createdDate: 'Sun Jun 04 2023 21:08:56 GMT+0900 (Japan Standard Time)',
//         name: 'Rochelle and Jamie',
//         id: '00f3911f-80f3-46ac-b594-e5f4c8763de9',
//         transactionType: 'debit',
//         startDate: '2023-06-11',
//         amount: '175000',
//       },
//     ];

//     console.log;
//     enhanceTargets(
//       targets,
//       usedCurrencies,
//       accounts,
//       accountTotals,
//       transactions
//     );
//   });
// });
