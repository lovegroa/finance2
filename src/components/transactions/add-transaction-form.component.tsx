import {ChangeEvent, FormEvent, useState} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {
  selectAccounts,
  selectUserAuth,
  selectUserData,
} from '../../store/user/user.slice';

import {UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {v4} from 'uuid';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
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
import {convertDateToString} from '../../utils/general/general.utils';

type ChildProps = {
  setShowAddTransactionForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTransactionForm: React.FC<ChildProps> = ({
  setShowAddTransactionForm: setShowAddTransactionForm,
}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const accounts = useAppSelector(selectAccounts);
  const primaryAccount = accounts.filter(account => account.isPriority)[0];

  const dispatch = useAppDispatch();

  const defaultFormFields: UserType['transactions'][0] = {
    createdDate: new Date().toString(),
    id: v4(),
    name: '',
    startDate: convertDateToString(new Date()),
    endDate: convertDateToString(new Date()),
    amount: '0',
    transactionType: 'debit',
    frequency: 'monthly',
    accountId: primaryAccount.id,
    paidDates: [],
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const {
    startDate,
    endDate,
    amount,
    transactionType,
    frequency,
    name,
    accountId,
  } = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const addTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    formFields.id = v4();
    newUserData.transactions.push(formFields);
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setShowAddTransactionForm(false);
    resetFormFields();
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
            Add transaction
          </Typography>
          <IconButton onClick={() => setShowAddTransactionForm(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box component="form" noValidate onSubmit={addTransaction} sx={{mt: 3}}>
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
                  <MenuItem value={'daily'}>Daily</MenuItem>
                  <MenuItem value={'weekly'}>Weekly</MenuItem>
                  <MenuItem value={'monthly'}>Monthly</MenuItem>
                  <MenuItem value={'yearly'}>Yearly</MenuItem>
                  <MenuItem value={'once'}>Once</MenuItem>
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Add transaction
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddTransactionForm;
