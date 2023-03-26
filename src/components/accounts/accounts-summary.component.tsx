import {FC} from 'react';
import {selectAccountTotals} from '../../store/user/user.slice';
import {useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

const AccountsSummary: FC = () => {
  const accountTotals = useAppSelector(selectAccountTotals);

  return (
    <TableContainer>
      <Table aria-label="accounts table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell colSpan={3} align="center">
              Actual
            </TableCell>
            <TableCell colSpan={3} align="center">
              Available
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Currency</strong>
            </TableCell>
            <TableCell align="right">Debit</TableCell>
            <TableCell align="right">Credit</TableCell>
            <TableCell align="right">
              <strong>Total</strong>
            </TableCell>
            <TableCell align="right">Debit</TableCell>
            <TableCell align="right">Credit</TableCell>
            <TableCell align="right">
              <strong>Total</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accountTotals.map((account, index) => {
            const formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: account.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
            return (
              <TableRow key={index}>
                <TableCell>{account.currency}</TableCell>
                <TableCell align="right">
                  {formatter.format(account.debit.onlyCalculated)}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(account.credit.onlyCalculated)}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(account.total.onlyCalculated)}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(
                    account.debit.onlyCalculated -
                      account.debit.onlyCalculatedLimit
                  )}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(
                    account.credit.onlyCalculatedLimit -
                      account.credit.onlyCalculated
                  )}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(
                    account.debit.onlyCalculated -
                      account.debit.onlyCalculatedLimit +
                      account.credit.onlyCalculatedLimit -
                      account.credit.onlyCalculated
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountsSummary;
