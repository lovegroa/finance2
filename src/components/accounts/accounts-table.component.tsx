import {FC} from 'react';
import {selectAccounts} from '../../store/user/user.slice';
import {useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalculateIcon from '@mui/icons-material/Calculate';
import MoneyIcon from '@mui/icons-material/Money';
import DoneIcon from '@mui/icons-material/Done';
import {UserType} from '../../store/user/user.types';

type ChildProps = {
  setCurrentAccount: React.Dispatch<
    React.SetStateAction<UserType['accounts'][0] | undefined>
  >;
  setShowAddAccountForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccountsTable: FC<ChildProps> = ({
  setCurrentAccount,
  setShowAddAccountForm,
}) => {
  const accounts = useAppSelector(selectAccounts);
  return (
    <TableContainer>
      <Table aria-label="accounts table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Account</strong>
            </TableCell>
            <TableCell align="right">
              <MoneyIcon></MoneyIcon>
            </TableCell>
            <TableCell align="center">
              <CalculateIcon></CalculateIcon>
            </TableCell>
            <TableCell align="center">
              <PriorityHighIcon></PriorityHighIcon>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...accounts]
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            .sort(a => {
              if (a.isPriority) return -1;
              return 0;
            })
            .map((account, index) => {
              const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: account.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
              return (
                <TableRow
                  key={index}
                  onClick={() => setCurrentAccount(account)}
                >
                  <TableCell>{account.name}</TableCell>
                  <TableCell
                    style={
                      account.accountType === 'credit' ? {color: 'red'} : {}
                    }
                    align="right"
                  >
                    {formatter.format(account.balance)}
                  </TableCell>
                  <TableCell align="center">
                    {account.includeInCalculations ? (
                      <DoneIcon></DoneIcon>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {account.isPriority ? <DoneIcon></DoneIcon> : <></>}
                  </TableCell>
                </TableRow>
              );
            })}
          <TableRow>
            <TableCell align="center" colSpan={4}>
              <Button
                type="submit"
                variant="outlined"
                sx={{mt: 3, mb: 2}}
                onClick={() => setShowAddAccountForm(true)}
              >
                Add account
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountsTable;
