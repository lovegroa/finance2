import {useState} from 'react';

import {Transaction} from '../store/user/user.types';
import {Container} from '@mui/material';

import AddTransactionForm from '../components/transactions/add-transaction-form.component';
import UpdateTransactionForm from '../components/transactions/update-transaction-form.component';
import TransactionsAccountsTabs from '../components/transactions/TransactionsAccountsTabs';
import {selectAccounts} from '../store/user/user.slice';
import {useAppSelector} from '../utils/hooks/hooks.utils';

const Transactions: React.FC = () => {
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>();
  const accounts = useAppSelector(selectAccounts);
  const [accountTab, setAccountTab] = useState(0);
  const [frequencyTab, setFrequencyTab] = useState(2);

  const showAddForm = () => {
    if (showAddTransactionForm) {
      return (
        <AddTransactionForm
          setShowAddTransactionForm={setShowAddTransactionForm}
        />
      );
    }
    return <></>;
  };
  const showUpdateForm = () => {
    if (currentTransaction) {
      return (
        <UpdateTransactionForm
          currentTransaction={currentTransaction}
          setCurrentTransaction={setCurrentTransaction}
        />
      );
    }
    return <></>;
  };
  const showTabs = () => {
    if (showAddTransactionForm || currentTransaction) {
      return <></>;
    }
    return (
      <TransactionsAccountsTabs
        ariaLabel="Accounts tabs"
        accounts={accounts}
        setCurrentTransaction={setCurrentTransaction}
        setShowAddTransactionForm={setShowAddTransactionForm}
        accountTab={accountTab}
        frequencyTab={frequencyTab}
        setAccountTab={setAccountTab}
        setFrequencyTab={setFrequencyTab}
      />
    );
  };

  return (
    <Container component="main" maxWidth="md">
      {showAddForm()}
      {showUpdateForm()}
      {showTabs()}
    </Container>
  );
};

export default Transactions;
