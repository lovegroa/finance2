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
  selectEnhancedTargets,
  selectUserAuth,
  selectUserData,
  selectformatter,
} from '../../store/user/user.slice';
import {UserType} from '../../store/user/user.types';
import {actionUpdateUserData} from '../../store/user/user.action';
import {EnhancedTargets} from '../../utils/general/general.utils';

type ChildProps = {
  targetId: string;
};

const TransactionsTable: React.FC<ChildProps> = ({targetId}) => {
  const targets = useAppSelector(selectEnhancedTargets).filter(
    ({_id}) => _id === targetId
  );

  const target = targets[0];

  const individualTransactions = target.total.transactions;

  const accounts = useAppSelector(selectAccounts);
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const {format} = useAppSelector(selectformatter);

  const dispatch = useAppDispatch();

  const findAccountByID = (id: string) => {
    return accounts.find(account => account.id === id);
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
          {individualTransactions.map((transaction, index) => {
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
                  {format(transaction.amount)}
                </TableCell>
                <TableCell align="center">
                  {findAccountByID(transaction.accountId)
                    ? findAccountByID(transaction.accountId)?.name
                    : 'Unknown account'}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      updateTransaction(transaction.date, transaction.id);
                    }}
                    variant="contained"
                  >
                    Paid
                  </Button>
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
