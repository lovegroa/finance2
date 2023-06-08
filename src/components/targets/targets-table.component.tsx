import {FC, useState} from 'react';
import {
  selectEnhancedTargets,
  selectTargets,
} from '../../store/user/user.slice';
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
import {Currency, UserType} from '../../store/user/user.types';
import {IndividualTransaction} from '../../utils/general/general.utils';
import TargetTransactionsLightbox from './target-transactions-lightbox.component';

type ChildProps = {
  setCurrentTarget: React.Dispatch<
    React.SetStateAction<UserType['targets'][0] | undefined>
  >;
  setShowAddTargetForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const TargetsTable: FC<ChildProps> = ({
  setCurrentTarget,
  setShowAddTargetForm,
}) => {
  const enhancedTargets = useAppSelector(selectEnhancedTargets);
  const targets = useAppSelector(selectTargets);
  const [expandTable, setExpandTable] = useState<Number>();
  const [transactions, setTransactions] = useState<IndividualTransaction[]>();
  const [currency, setCurrency] = useState<Currency>('GBP');

  return (
    <>
      <TargetTransactionsLightbox
        setTransactions={setTransactions}
        transactions={transactions}
        currency={currency}
      />
      <TableContainer>
        <Table aria-label="targets table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Start Date</strong>
              </TableCell>
              <TableCell>
                <strong>End Date</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Initial Balance</strong>
              </TableCell>
              <TableCell>
                <strong>End Balance</strong>
              </TableCell>
              <TableCell>
                <strong>Cash Per Day</strong>
              </TableCell>
              <TableCell>
                <strong>Credits</strong>
              </TableCell>
              <TableCell>
                <strong>Debits</strong>
              </TableCell>
              <TableCell>
                <strong>Disposable income</strong>
              </TableCell>
              <TableCell>
                <strong>Days</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...enhancedTargets].map(
              ({total, accounts, currency, _id}, index) => {
                const formatter = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                });
                return (
                  <>
                    <TableRow
                      key={index}
                      onClick={() =>
                        expandTable === index
                          ? setExpandTable(undefined)
                          : setExpandTable(index)
                      }
                    >
                      <TableCell>
                        {total.dateBegin.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {total.dateEnd.toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setCurrentTarget(
                            targets.filter(target => target._id === _id)[0]
                          );
                        }}
                      >
                        {total.name}
                      </TableCell>
                      <TableCell>
                        {formatter.format(total.balanceBegin)}
                      </TableCell>
                      <TableCell>
                        {formatter.format(total.balanceEnd)}
                      </TableCell>
                      <TableCell>
                        {formatter.format(total.cashPerDay)}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setTransactions(total.transactions);
                          setCurrency(currency);
                        }}
                      >
                        {formatter.format(total.totalCredit)}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setTransactions(total.transactions);
                          setCurrency(currency);
                        }}
                      >
                        {formatter.format(total.totalDebit)}
                      </TableCell>
                      <TableCell>
                        {formatter.format(total.balanceDisposable)}
                      </TableCell>
                      <TableCell>{total.days}</TableCell>
                    </TableRow>
                    {expandTable === index
                      ? accounts.map((account, index) => {
                          return (
                            <TableRow
                              key={index}
                              // onClick={() => setCurrentTarget(target)}
                            >
                              <TableCell>
                                {/* {account.dateBegin.toLocaleDateString()} */}
                              </TableCell>
                              <TableCell>
                                {/* {account.dateEnd.toLocaleDateString()} */}
                              </TableCell>
                              <TableCell>{account.name}</TableCell>
                              <TableCell>
                                {formatter.format(account.balanceBegin)}
                              </TableCell>
                              <TableCell>
                                {formatter.format(account.balanceEnd)}
                              </TableCell>
                              <TableCell>
                                {formatter.format(account.cashPerDay)}
                              </TableCell>
                              <TableCell
                                onClick={() => {
                                  setTransactions(account.transactions);
                                  setCurrency(currency);
                                }}
                              >
                                {formatter.format(account.totalCredit)}
                              </TableCell>
                              <TableCell
                                onClick={() => {
                                  setTransactions(account.transactions);
                                  setCurrency(currency);
                                }}
                              >
                                {formatter.format(account.totalDebit)}
                              </TableCell>
                              <TableCell>
                                {formatter.format(account.balanceDisposable)}
                              </TableCell>
                              <TableCell>{account.days}</TableCell>
                            </TableRow>
                          );
                        })
                      : ''}
                  </>
                );
              }
            )}
            <TableRow>
              <TableCell align="center" colSpan={4}>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{mt: 3, mb: 2}}
                  onClick={() => setShowAddTargetForm(true)}
                >
                  Add target
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TargetsTable;
