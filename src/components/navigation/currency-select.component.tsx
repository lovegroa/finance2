import {FormControl, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../utils/hooks/hooks.utils';
import {
  selectCurrency,
  selectUserAuth,
  selectUserData,
} from '../../store/user/user.slice';
import {Currency, UserType} from '../../store/user/user.types';
import {actionUpdateUserData} from '../../store/user/user.action';

export default function CurrencySelect() {
  const userData = useAppSelector(selectUserData);
  const userAuth = useAppSelector(selectUserAuth);
  let currency = useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();

  if (!currency) currency = 'GBP';

  const updateCurrency = async (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (!userAuth) return;
    const newUserData = JSON.parse(JSON.stringify(userData)) as UserType;
    newUserData.currency = event.target.value as Currency;
    dispatch(actionUpdateUserData(userAuth, newUserData));
  };

  return (
    <div>
      <FormControl>
        <Select
          value={currency}
          onChange={updateCurrency}
          inputProps={{'aria-label': 'Without label'}}
          sx={{
            color: 'white',
            border: 'none',
            '& fieldset': {
              border: 'none',
            },
            '& svg': {
              fill: 'white', // Hide the default dropdown arrow
            },
          }}
        >
          <MenuItem value={'GBP'}>GBP</MenuItem>
          <MenuItem value={'USD'}>USD</MenuItem>
          <MenuItem value={'JPY'}>JPY</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
