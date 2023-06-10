import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {Dispatch, SetStateAction} from 'react';
import {IndividualTransaction} from '../../utils/general/general.utils';
import {Currency} from '../../store/user/user.types';

type ChildProps = {
  setTransactions: Dispatch<
    SetStateAction<IndividualTransaction[] | undefined>
  >;
  transactions: IndividualTransaction[] | undefined;
  currency: Currency;
};

const TargetTransactionsLightbox: React.FC<ChildProps> = ({
  setTransactions,
  transactions,
  currency,
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    <Modal
      id="modal"
      open={!!transactions}
      onClose={() => setTransactions(undefined)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '30px',
          maxHeight: '80vh',
          minHeight: '40vh ',
          overflow: 'scroll',
        }}
      >
        <TableContainer>
          <Table aria-label="targets table">
            <TableHead>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Debits</TableCell>
            </TableHead>
            <TableBody>
              {transactions?.map((transaction, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      {transaction.transactionType === 'credit'
                        ? formatter.format(transaction.amount)
                        : ''}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      {transaction.transactionType === 'debit'
                        ? formatter.format(transaction.amount)
                        : ''}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default TargetTransactionsLightbox;
