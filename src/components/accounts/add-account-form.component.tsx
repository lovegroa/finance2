import {ChangeEvent, FormEvent, useState} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {selectUserAuth, selectUserData} from '../../store/user/user.slice';

import {UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {v4} from 'uuid';
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormGroup,
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

const defaultFormFields: UserType['accounts'][0] = {
  balance: 0,
  color: '#000000',
  createdDate: new Date().toString(),
  id: v4(),
  includeInCalculations: true,
  isPriority: false,
  balanceLimit: 0,
  name: '',
  accountType: 'debit',
  currency: 'USD',
};

type ChildProps = {
  setShowAddAccountForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddAccountForm: React.FC<ChildProps> = ({setShowAddAccountForm}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {
    balance,
    color,
    includeInCalculations,
    isPriority,
    balanceLimit,
    name,
    accountType,
    currency,
  } = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    if (name === 'isPriority' || name === 'includeInCalculations') {
      setFormFields({...formFields, [name]: !formFields[name]});
    } else {
      setFormFields({...formFields, [name]: value});
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const addAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    formFields.id = v4();
    newUserData.accounts.push(formFields);
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setShowAddAccountForm(false);
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
            Add account
          </Typography>
          <IconButton onClick={() => setShowAddAccountForm(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box component="form" noValidate onSubmit={addAccount} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="account name"
                name="name"
                required
                fullWidth
                id="name"
                label="Account name"
                onChange={handleChange}
                value={name}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="accountType">Account type</InputLabel>
                <Select
                  labelId="accountType"
                  id="accountType"
                  value={accountType}
                  label="Account type"
                  onChange={handleSelectChange}
                  name="accountType"
                >
                  <MenuItem value={'debit'}>Debit</MenuItem>
                  <MenuItem value={'credit'}>Credit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="color"
                name="color"
                fullWidth
                id="color"
                label="Account color"
                onChange={handleChange}
                value={color}
                type="color"
              />
            </Grid>
            <Grid item xs={2.5}>
              <FormControl fullWidth>
                <InputLabel id="currency">CCY</InputLabel>
                <Select
                  labelId="currency"
                  id="currency"
                  value={currency}
                  label="Currency"
                  onChange={handleSelectChange}
                  name="currency"
                >
                  <MenuItem value={'USD'}>$</MenuItem>
                  <MenuItem value={'GBP'}>£</MenuItem>
                  <MenuItem value={'JPY'}>¥</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4.75}>
              <TextField
                autoComplete="balance"
                name="balance"
                required
                fullWidth
                id="balance"
                label="Balance"
                onChange={handleChange}
                value={balance}
                type="number"
              />
            </Grid>
            <Grid item xs={4.75}>
              <TextField
                autoComplete="balanceLimit"
                name="balanceLimit"
                required
                fullWidth
                id="balanceLimit"
                label={accountType === 'debit' ? 'Min balance' : 'Credit limit'}
                onChange={handleChange}
                value={balanceLimit}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChange}
                      checked={isPriority}
                      name="isPriority"
                    />
                  }
                  label="Priority account"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChange}
                      checked={includeInCalculations}
                      name="includeInCalculations"
                    />
                  }
                  label="Include in calculations"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Add account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddAccountForm;
