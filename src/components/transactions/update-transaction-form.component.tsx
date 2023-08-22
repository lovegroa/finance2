import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useState,
  MouseEvent,
} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {
  selectAccounts,
  selectFrequencies,
  selectUserAuth,
  selectUserData,
} from '../../store/user/user.slice';

import {Transaction, UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ChildProps = {
  setCurrentTransaction: Dispatch<SetStateAction<Transaction | undefined>>;
  currentTransaction: Transaction;
};

const UpdateTransactionForm: FC<ChildProps> = ({
  setCurrentTransaction,
  currentTransaction,
}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const accounts = useAppSelector(selectAccounts);
  const frequencies = useAppSelector(selectFrequencies);

  const dispatch = useAppDispatch();

  const [formFields, setFormFields] = useState(currentTransaction);
  const {
    startDate,
    endDate,
    amount,
    transactionType,
    frequency,
    name,
    accountId,
    noEndDate,
  } = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    if (name === 'noEndDate') {
      setFormFields({
        ...formFields,
        [name]: !formFields[name],
      });
    } else {
      if (frequency === 'once') {
        setFormFields({
          ...formFields,
          [name]: value,
          endDate: name === 'startDate' ? value : startDate,
          noEndDate: false,
        });
      } else {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value});
      }
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const updateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    const index = newUserData.transactions.findIndex(transaction => {
      return transaction.id === formFields.id;
    });
    if (index === -1) return;
    newUserData.transactions[index] = formFields;
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentTransaction(undefined);
  };

  const deleteTransaction = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    newUserData.transactions = newUserData.transactions.filter(transaction => {
      return transaction.id !== formFields.id;
    });
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentTransaction(undefined);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container justifyContent={'space-between'}>
          <Typography component="h1" variant="h5">
            Edit transaction
          </Typography>
          <IconButton onClick={() => setCurrentTransaction(undefined)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box component="form" onSubmit={updateTransaction} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="transaction name"
                name="name"
                required
                fullWidth
                id="name"
                label="Transaction name"
                onChange={handleChange}
                value={name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="amount"
                name="amount"
                required
                fullWidth
                id="amount"
                label="Amount"
                onChange={handleChange}
                value={amount}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="TransactionType">Transaction type</InputLabel>
                <Select
                  labelId="transactionType"
                  id="transactionType"
                  value={transactionType}
                  label="Transaction type"
                  onChange={handleSelectChange}
                  name="transactionType"
                >
                  <MenuItem value={'debit'}>Debit</MenuItem>
                  <MenuItem value={'credit'}>Credit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="frequency">Frequency</InputLabel>
                <Select
                  labelId="frequency"
                  id="frequency"
                  value={frequency}
                  label="Frequency"
                  onChange={handleSelectChange}
                  name="frequency"
                >
                  {Array.from(frequencies).map(frequency => (
                    <MenuItem
                      sx={{textTransform: 'capitalize'}}
                      value={frequency}
                    >
                      {frequency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="accountId">Account</InputLabel>
                <Select
                  labelId="accountId"
                  id="accountId"
                  value={accountId}
                  label="Account"
                  onChange={handleSelectChange}
                  name="accountId"
                >
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="start date"
                name="startDate"
                required
                fullWidth
                id="startDate"
                label="Start date"
                onChange={handleChange}
                value={startDate}
                type="date"
              />
            </Grid>
            {frequency !== 'once' ? (
              <>
                {!noEndDate ? (
                  <Grid item xs={6}>
                    <TextField
                      autoComplete="end date"
                      name="endDate"
                      required
                      fullWidth
                      id="endDate"
                      label="End date"
                      onChange={handleChange}
                      value={endDate}
                      type="date"
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleChange}
                        checked={noEndDate}
                        name="noEndDate"
                      />
                    }
                    label="No end date"
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Update transaction
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={deleteTransaction}
            color="error"
          >
            Delete Transaction
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateTransactionForm;
