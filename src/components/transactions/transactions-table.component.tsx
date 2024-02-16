import {FC, Fragment} from 'react';
import {useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import MoneyIcon from '@mui/icons-material/Money';
import {
  Account,
  Frequency,
  Transaction,
  UserType,
} from '../../store/user/user.types';
import {selectTransactions, selectformatter} from '../../store/user/user.slice';
import {getDate} from 'date-fns';

type ChildProps = {
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<UserType['transactions'][0] | undefined>
  >;
  setShowAddTransactionForm: React.Dispatch<React.SetStateAction<boolean>>;
  account: Account;
  frequency: Frequency;
};

const TransactionsTable: FC<ChildProps> = ({
  setCurrentTransaction,
  setShowAddTransactionForm,
  account,
  frequency,
}) => {
  const transactions = useAppSelector(selectTransactions);
  const formatter = useAppSelector(selectformatter);

  const accountTransactions: Transaction[] = transactions.filter(
    transaction =>
      transaction.accountId === account.id &&
      transaction.frequency === frequency
  );

  accountTransactions.sort((a, b) => {
    let result = 0;

    if (a.name < b.name) {
      result = -1;
    }
    if (a.name > b.name) {
      result = 1;
    }

    const aDate = getDate(new Date(a.startDate));
    const bDate = getDate(new Date(b.startDate));

    if (aDate < bDate) {
      result = -1;
    }
    if (aDate > bDate) {
      result = 1;
    }
    return result;
  });

  console.log(accountTransactions, 'accountTransactions');

  return (
    <TableContainer>
      <Table aria-label="accounts table">
        <TableBody>
          <>
            {
              <Fragment key={account.id}>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell align="right">
                    <MoneyIcon></MoneyIcon>
                  </TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
                {accountTransactions.map(transaction => {
                  return (
                    <TableRow
                      key={transaction.id}
                      onClick={() => setCurrentTransaction(transaction)}
                    >
                      <TableCell>{transaction.name}</TableCell>

                      <TableCell
                        align="right"
                        style={
                          transaction.transactionType === 'debit'
                            ? {color: 'red'}
                            : {}
                        }
                      >
                        {formatter.format(Number(transaction.amount))}
                      </TableCell>
                      <TableCell align="right">
                        {getDate(new Date(transaction.startDate))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            }
            <TableRow>
              <TableCell align="center" colSpan={4}>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{mt: 3, mb: 2}}
                  onClick={() => setShowAddTransactionForm(true)}
                >
                  Add transaction
                </Button>
              </TableCell>
            </TableRow>
          </>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
