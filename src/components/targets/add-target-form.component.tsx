import {ChangeEvent, FormEvent, useState} from 'react';
import {actionUpdateUserData} from '../../store/user/user.action';
import {
  selectCurrency,
  selectUserAuth,
  selectUserData,
} from '../../store/user/user.slice';

import {Target, UserType} from '../../store/user/user.types';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {v4} from 'uuid';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {EnhancedTargets} from '../../utils/general/general.utils';

type ChildProps = {
  setShowAddTargetForm: React.Dispatch<React.SetStateAction<boolean>>;
  enhancedTargets: EnhancedTargets[];
};

//if end date is defined, find the date in the enhanced Targets

const AddTargetForm: React.FC<ChildProps> = ({
  setShowAddTargetForm,
  enhancedTargets,
}) => {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  const globalCurrency = useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();

  const defaultFormFields: Target = {
    _id: v4(),
    balanceEnd: '0',
    currency: globalCurrency,
    dateCreated: new Date().toString(),
    dateEnd: new Date().toISOString().split('T')[0],
  };
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {balanceEnd, dateEnd} = formFields;

  const findBalance = (dateEnd: string | undefined) => {
    if (!dateEnd) return '0';
    const target = enhancedTargets.filter(target => {
      return (
        target.total.dateBegin.toISOString().split('T')[0] <=
          new Date(dateEnd).toISOString().split('T')[0] &&
        target.total.dateEnd.toISOString().split('T')[0] >=
          new Date(dateEnd).toISOString().split('T')[0]
      );
    })[0];

    //this should return the right target if it exists

    if (!target) return '0';

    const {dateBegin, dataset} = target.total;

    const dateDifference = new Date(dateEnd).getTime() - dateBegin.getTime();
    const days = Math.ceil(dateDifference / (1000 * 3600 * 24)) + 1;
    return Math.round(dataset[days - 1]).toString();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    if (name === 'dateEnd') {
      setFormFields({
        ...formFields,
        [name]: value,
        balanceEnd: findBalance(value),
      });
    } else {
      setFormFields({...formFields, [name]: value});
    }
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
