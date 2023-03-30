import {useState} from 'react';
import Navigation from '../components/navigation/navigation.component';

import {UserType} from '../store/user/user.types';
import {Container} from '@mui/material';

import TransactionsTable from '../components/transactions/transactions-table.component';
import AddTransactionForm from '../components/transactions/add-transaction-form.component';

const Transactions: React.FC = () => {
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<UserType['transactions'][0]>();

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
          //   <UpdateAccountForm
          //     currentAccount={currentTransaction}
          //     setCurrentAccount={setCurrentTransaction}
          //   />
          <TransactionsTable
            setCurrentTransaction={setCurrentTransaction}
            setShowAddTransactionForm={setShowAddTransactionForm}
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
