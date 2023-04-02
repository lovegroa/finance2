import {useState} from 'react';
import Navigation from '../components/navigation/navigation.component';

import {Transaction} from '../store/user/user.types';
import {Container} from '@mui/material';

import TransactionsTable from '../components/transactions/transactions-table.component';
import AddTransactionForm from '../components/transactions/add-transaction-form.component';
import UpdateTransactionForm from '../components/transactions/update-transaction-form.component';

const Transactions: React.FC = () => {
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>();

  return (
    <div>
      <Navigation></Navigation>
      <br></br>
      <Container component="main" maxWidth="md">
        {showAddTransactionForm ? (
          <AddTransactionForm
            setShowAddTransactionForm={setShowAddTransactionForm}
          />
        ) : currentTransaction ? (
          <UpdateTransactionForm
            currentTransaction={currentTransaction}
            setCurrentTransaction={setCurrentTransaction}
          />
        ) : (
          <>
            {/* <AccountsSummary /> <br></br> */}
            <TransactionsTable
              setCurrentTransaction={setCurrentTransaction}
              setShowAddTransactionForm={setShowAddTransactionForm}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default Transactions;
