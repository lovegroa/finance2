import {ChangeEvent, FormEvent, useState, MouseEvent} from 'react';
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
import {UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {selectUserAuth, selectUserData} from '../../store/user/user.slice';
import {actionUpdateUserData} from '../../store/user/user.action';
import CloseIcon from '@mui/icons-material/Close';

type ChildProps = {
  setCurrentAccount: React.Dispatch<
    React.SetStateAction<UserType['accounts'][0] | undefined>
  >;
  currentAccount: UserType['accounts'][0];
};

const UpdateAccountForm: React.FC<ChildProps> = ({
  setCurrentAccount,
  currentAccount,
}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] = useState(currentAccount);
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

  const updateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    const index = newUserData.accounts.findIndex(account => {
      return account.id === formFields.id;
    });
    if (index === -1) return;
    newUserData.accounts[index] = formFields;
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentAccount(undefined);
  };

  const deleteAccount = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    newUserData.accounts = newUserData.accounts.filter(account => {
      return account.id !== formFields.id;
    });
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentAccount(undefined);
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
            Update account
          </Typography>
          <IconButton onClick={() => setCurrentAccount(undefined)}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <Box component="form" noValidate onSubmit={updateAccount} sx={{mt: 3}}>
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
            Update account
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={deleteAccount}
            color="error"
          >
            Delete account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateAccountForm;
