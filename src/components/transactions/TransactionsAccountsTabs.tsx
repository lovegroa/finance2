import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TransactionTab from './Tab';
import {Account, Transaction} from '../../store/user/user.types';
import FrequencyTabs from './FrequencyTabs';
import {Dispatch} from 'react';

type Props = {
  accounts: Account[];
  ariaLabel: string;
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<Transaction | undefined>
  >;
  setShowAddTransactionForm: React.Dispatch<React.SetStateAction<boolean>>;
  accountTab: number;
  setAccountTab: Dispatch<React.SetStateAction<number>>;
  frequencyTab: number;
  setFrequencyTab: Dispatch<React.SetStateAction<number>>;
};

export default function TransactionsAccountsTabs({
  accounts,
  ariaLabel,
  setCurrentTransaction,
  setShowAddTransactionForm,
  accountTab,
  frequencyTab,
  setAccountTab,
  setFrequencyTab,
}: Props) {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setAccountTab(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={accountTab} onChange={handleChange} aria-label={ariaLabel}>
          {accounts.map(({name, id}) => (
            <Tab key={id} label={name} />
          ))}
        </Tabs>
      </Box>
      {accounts.map((account, index) => (
        <TransactionTab key={account.id} value={accountTab} index={index}>
          <FrequencyTabs
            setCurrentTransaction={setCurrentTransaction}
            setShowAddTransactionForm={setShowAddTransactionForm}
            account={account}
            frequencyTab={frequencyTab}
            setFrequencyTab={setFrequencyTab}
          />
        </TransactionTab>
      ))}
    </Box>
  );
}
