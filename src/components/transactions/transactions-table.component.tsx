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
import {UserType} from '../../store/user/user.types';
import {selectTransactions, selectAccounts} from '../../store/user/user.slice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type ChildProps = {
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<UserType['transactions'][0] | undefined>
  >;
  setShowAddTransactionForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransactionsTable: FC<ChildProps> = ({
  setCurrentTransaction,
  setShowAddTransactionForm,
}) => {
  const transactions = useAppSelector(selectTransactions);
  const accounts = useAppSelector(selectAccounts);
  return (
    <TableContainer>
      <Table aria-label="accounts table">
        <TableBody>
          <>
            {[...accounts]
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .map(account => {
                const accountTransactions: UserType['transactions'] =
                  transactions.filter(
                    transaction => transaction.accountId === account.id
                  );
                if (accountTransactions.length === 0) return;
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: account.currency,
                  minimumFractionDigits: account.currency === 'JPY' ? 0 : 2,
                  maximumFractionDigits: account.currency === 'JPY' ? 0 : 2,
                });

                return (
                  <Fragment key={account.id}>
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        <strong>{account.name}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell align="center">
                        <AccessTimeIcon></AccessTimeIcon>
                      </TableCell>
                      <TableCell align="right">
                        <MoneyIcon></MoneyIcon>
                      </TableCell>
                    </TableRow>
                    {accountTransactions.map(transaction => {
                      return (
                        <TableRow
                          key={transaction.id}
                          onClick={() => setCurrentTransaction(transaction)}
                        >
                          <TableCell>{transaction.name}</TableCell>
                          <TableCell align="center">
                            {transaction.frequency}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={
                              transaction.transactionType === 'debit'
                                ? {color: 'red'}
                                : {}
                            }
                          >
                            {formatter.format(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              })}
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
