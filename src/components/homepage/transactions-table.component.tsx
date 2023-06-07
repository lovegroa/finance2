import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  selectAccounts,
  selectIndividualTransactions,
  selectUserAuth,
  selectUserData,
} from '../../store/user/user.slice';
import {UserType} from '../../store/user/user.types';
import {actionUpdateUserData} from '../../store/user/user.action';

type ChildProps = {
  currencyState: string;
};

const TransactionsTable: React.FC<ChildProps> = ({currencyState}) => {
  const currencyTransactions = useAppSelector(selectIndividualTransactions);
  const accounts = useAppSelector(selectAccounts);
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();

  const findAccountByID = (id: string) => {
    return accounts.find(account => account.id === id);
  };

  const formatValue = (value: number) => {
    if (!currencyState) return;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyState,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const updateTransaction = async (date: string, id: string) => {
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    const index = newUserData.transactions.findIndex(transaction => {
      return transaction.id === id;
    });
    if (index === -1) return;
    newUserData.transactions[index].paidDates.push(date);
    dispatch(actionUpdateUserData(userAuth, newUserData));
  };

  return (
    <TableContainer>
      <Table aria-label="transactions table">
        <TableBody>
          {currencyTransactions[currencyState].map((transaction, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell
                  style={
                    transaction.transactionType === 'debit'
                      ? {color: 'red'}
                      : {}
                  }
                  align="right"
                >
                  {formatValue(transaction.amount)}
                </TableCell>
                <TableCell align="center">
                  {findAccountByID(transaction.accountId) ? (
                    findAccountByID(transaction.accountId)?.name
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      updateTransaction(transaction.date, transaction.id);
                    }}
                    variant="contained"
                  ></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
