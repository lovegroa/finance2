import {ChangeEvent, FormEvent, useState} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {selectUserAuth, selectUserData} from '../../store/user/user.slice';

import {Target, UserType} from '../../store/user/user.types';
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

const defaultFormFields: Target = {
  _id: v4(),
  balanceEnd: '0',
  currency: 'USD',
  dateCreated: new Date().toString(),
  dateEnd: new Date().toString(),
};

type ChildProps = {
  setShowAddTargetForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTargetForm: React.FC<ChildProps> = ({setShowAddTargetForm}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {balanceEnd, currency, dateEnd} = formFields;

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

  const addTarget = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    formFields._id = v4();
    newUserData.targets.push(formFields);
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setShowAddTargetForm(false);
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
            Add target
          </Typography>
          <IconButton onClick={() => setShowAddTargetForm(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box component="form" noValidate onSubmit={addTarget} sx={{mt: 3}}>
          <Grid container spacing={2}>
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
                autoComplete="balanceEnd"
                name="balanceEnd"
                required
                fullWidth
                id="balanceEnd"
                label="End Balance"
                onChange={handleChange}
                value={balanceEnd}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="dateEnd"
                name="dateEnd"
                required
                fullWidth
                id="dateEnd"
                label="End date"
                onChange={handleChange}
                value={dateEnd}
                type="date"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Add target
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddTargetForm;
