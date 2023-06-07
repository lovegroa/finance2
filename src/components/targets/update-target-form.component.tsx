import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
  MouseEvent,
} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {selectUserAuth, selectUserData} from '../../store/user/user.slice';

import {Target, UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
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

type ChildProps = {
  setCurrentTarget: Dispatch<SetStateAction<Target | undefined>>;
  currentTarget: Target;
};

const UpdateTargetForm: React.FC<ChildProps> = ({
  setCurrentTarget,
  currentTarget,
}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const dispatch = useAppDispatch();
  const [formFields, setFormFields] = useState(currentTarget);
  const {balanceEnd, currency, dateEnd} = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value});
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value});
  };

  const updateTarget = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    const index = newUserData.targets.findIndex(target => {
      return target._id === formFields._id;
    });
    if (index === -1) return;
    newUserData.targets[index] = formFields;
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentTarget(undefined);
  };

  const deleteTarget = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    newUserData.targets = newUserData.targets.filter(target => {
      return target._id !== formFields._id;
    });
    dispatch(actionUpdateUserData(userAuth, newUserData));
    setCurrentTarget(undefined);
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
          <IconButton onClick={() => setCurrentTarget(undefined)}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Box component="form" noValidate onSubmit={updateTarget} sx={{mt: 3}}>
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
            Update target
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={deleteTarget}
            color="error"
          >
            Delete target
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateTargetForm;
