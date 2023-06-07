import {useState} from 'react';
import Navigation from '../components/navigation/navigation.component';

import {UserType} from '../store/user/user.types';
import {Container} from '@mui/material';
import TargetsTable from '../components/targets/targets-table.component';
import AddTargetForm from '../components/targets/add-target-form.component';
import UpdateTargetForm from '../components/targets/update-target-form.component';

const Targets: React.FC = () => {
  const [showAddTargetForm, setShowAddTargetForm] = useState(false);
  const [currenTarget, setCurrentTarget] = useState<UserType['targets'][0]>();

  return (
    <div>
      <Navigation></Navigation>
      <br></br>
      <Container component="main" maxWidth="md">
        {showAddTargetForm ? (
          <AddTargetForm setShowAddTargetForm={setShowAddTargetForm} />
        ) : currenTarget ? (
          <UpdateTargetForm
            currentTarget={currenTarget}
            setCurrentTarget={setCurrentTarget}
          />
        ) : (
          <TargetsTable
            setCurrentTarget={setCurrentTarget}
            setShowAddTargetForm={setShowAddTargetForm}
          />
        )}
      </Container>
    </div>
  );
};

export default Targets;
