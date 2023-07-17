import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
import {format as formatDate} from 'date-fns';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';

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

  const formattedDateHandler = (date: Date) => {
    return formatDate(date, 'EEE d MMM');
  };

  return (
    <TableContainer sx={{height: '100%'}}>
      <Table aria-label="transactions table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Transaction</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Account</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{overflow: 'auto'}}>
          {individualTransactions.map((transaction, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  {formattedDateHandler(new Date(transaction.date))}
                </TableCell>
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
                <TableCell align="left">
                  {findAccountByID(transaction.accountId)
                    ? findAccountByID(transaction.accountId)?.name
                    : 'Unknown account'}
                </TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <StarPurple500Icon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      updateTransaction(transaction.date, transaction.id);
                    }}
                  >
                    <PaidIcon />
                  </IconButton>
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
