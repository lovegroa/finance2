import {FC} from 'react';
import {
  selectAccountTotals,
  selectCurrency,
  selectformatter,
} from '../../store/user/user.slice';
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
  const {debit, credit, total} = useAppSelector(selectAccountTotals);
  const currency = useAppSelector(selectCurrency);
  const {format} = useAppSelector(selectformatter);

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
          <TableRow>
            <TableCell>{currency}</TableCell>
            <TableCell align="right">{format(debit.onlyCalculated)}</TableCell>
            <TableCell align="right">{format(credit.onlyCalculated)}</TableCell>
            <TableCell align="right">{format(total.onlyCalculated)}</TableCell>
            <TableCell align="right">
              {format(debit.onlyCalculated - debit.onlyCalculatedLimit)}
            </TableCell>
            <TableCell align="right">
              {format(credit.onlyCalculatedLimit - credit.onlyCalculated)}
            </TableCell>
            <TableCell align="right">
              {format(
                debit.onlyCalculated -
                  debit.onlyCalculatedLimit +
                  credit.onlyCalculatedLimit -
                  credit.onlyCalculated
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountsSummary;
