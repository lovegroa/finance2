import {useState} from 'react';
import Navigation from '../components/navigation/navigation.component';

import {UserType} from '../store/user/user.types';
import {Button, Container} from '@mui/material';

import AccountsTable from '../components/accounts/accounts-table.component';
import AddAccountForm from '../components/accounts/add-account-form.component';
import UpdateAccountForm from '../components/accounts/update-account-form.component';
import AccountsSummary from '../components/accounts/accounts-summary.component';

const Accounts: React.FC = () => {
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [currenAccount, setCurrentAccount] =
    useState<UserType['accounts'][0]>();

  return (
    <div>
      <Navigation></Navigation>
      <br></br>
      <Container component="main" maxWidth="md">
        {showAddAccountForm ? (
          <AddAccountForm setShowAddAccountForm={setShowAddAccountForm} />
        ) : currenAccount ? (
          <UpdateAccountForm
            currentAccount={currenAccount}
            setCurrentAccount={setCurrentAccount}
          />
        ) : (
          <>
            <AccountsSummary /> <br></br>
            <AccountsTable
              setCurrentAccount={setCurrentAccount}
              setShowAddAccountForm={setShowAddAccountForm}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default Accounts;
