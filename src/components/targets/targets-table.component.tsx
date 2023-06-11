import {FC, useState} from 'react';
import {
  selectCurrency,
  selectEnhancedTargets,
  selectTargets,
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
  Button,
} from '@mui/material';
import {UserType} from '../../store/user/user.types';
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
  const currency = useAppSelector(selectCurrency);
  const {format} = useAppSelector(selectformatter);
  const [expandTable, setExpandTable] = useState<Number>();
  const [transactions, setTransactions] = useState<IndividualTransaction[]>();

  return (
    <>
      <TargetTransactionsLightbox
        setTransactions={setTransactions}
        transactions={transactions}
        currency={currency}
      />
      <TableContainer>
        <Table aria-label="targets table" stickyHeader={true}>
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
            {[...enhancedTargets].map(({total, accounts, _id}, index) => {
              return (
                <>
                  <TableRow
                    key={index}
                    selected={expandTable === index}
                    onClick={() =>
                      expandTable === index
                        ? setExpandTable(undefined)
                        : setExpandTable(index)
                    }
                  >
                    <TableCell>
                      {total.dateBegin.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{total.dateEnd.toLocaleDateString()}</TableCell>
                    <TableCell
                      onClick={() => {
                        setCurrentTarget(
                          targets.filter(target => target._id === _id)[0]
                        );
                      }}
                    >
                      {total.name}
                    </TableCell>
                    <TableCell>{format(total.balanceBegin)}</TableCell>
                    <TableCell>{format(total.balanceEnd)}</TableCell>
                    <TableCell>{format(total.cashPerDay)}</TableCell>
                    <TableCell
                      onClick={() => {
                        setTransactions(total.transactions);
                      }}
                    >
                      {format(total.totalCredit)}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setTransactions(total.transactions);
                      }}
                    >
                      {format(total.totalDebit)}
                    </TableCell>
                    <TableCell>{format(total.balanceDisposable)}</TableCell>
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
                              {format(account.balanceBegin)}
                            </TableCell>
                            <TableCell>{format(account.balanceEnd)}</TableCell>
                            <TableCell>{format(account.cashPerDay)}</TableCell>
                            <TableCell
                              onClick={() => {
                                setTransactions(account.transactions);
                              }}
                            >
                              {format(account.totalCredit)}
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                setTransactions(account.transactions);
                              }}
                            >
                              {format(account.totalDebit)}
                            </TableCell>
                            <TableCell>
                              {format(account.balanceDisposable)}
                            </TableCell>
                            <TableCell>{account.days}</TableCell>
                          </TableRow>
                        );
                      })
                    : ''}
                </>
              );
            })}
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
