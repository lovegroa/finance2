import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TransactionTab from './Tab';
import {selectFrequencies} from '../../store/user/user.slice';
import {useAppSelector} from '../../utils/hooks/hooks.utils';
import TransactionsTable from './transactions-table.component';
import {Account, UserType} from '../../store/user/user.types';
import {Dispatch} from 'react';

type Props = {
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<UserType['transactions'][0] | undefined>
  >;
  setShowAddTransactionForm: React.Dispatch<React.SetStateAction<boolean>>;
  account: Account;
  frequencyTab: number;
  setFrequencyTab: Dispatch<React.SetStateAction<number>>;
};

export default function FrequencyTabs({
  setCurrentTransaction,
  setShowAddTransactionForm,
  account,
  frequencyTab,
  setFrequencyTab,
}: Props) {
  const frequencies = Array.from(useAppSelector(selectFrequencies));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setFrequencyTab(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs
          value={frequencyTab}
          onChange={handleChange}
          aria-label={'frequency-tabs'}
        >
          {frequencies.map(frequency => (
            <Tab key={frequency} label={frequency} />
          ))}
        </Tabs>
      </Box>
      {frequencies.map((frequency, index) => (
        <TransactionTab key={frequency} value={frequencyTab} index={index}>
          <TransactionsTable
            setCurrentTransaction={setCurrentTransaction}
            setShowAddTransactionForm={setShowAddTransactionForm}
            account={account}
            frequency={frequency}
          />
        </TransactionTab>
      ))}
    </Box>
  );
}
