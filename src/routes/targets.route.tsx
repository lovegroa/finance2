import {useState} from 'react';
import {UserType} from '../store/user/user.types';
import {Box, Button, Typography} from '@mui/material';
import TargetsTable from '../components/targets/targets-table.component';
import AddTargetForm from '../components/targets/add-target-form.component';
import UpdateTargetForm from '../components/targets/update-target-form.component';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {selectEnhancedTargets, selectTargets} from '../store/user/user.slice';

const Targets: React.FC = () => {
  const [showAddTargetForm, setShowAddTargetForm] = useState(false);
  const [currenTarget, setCurrentTarget] = useState<UserType['targets'][0]>();
  const enhancedTargets = useAppSelector(selectEnhancedTargets);
  const targets = useAppSelector(selectTargets);

  if (showAddTargetForm) {
    return (
      <AddTargetForm
        setShowAddTargetForm={setShowAddTargetForm}
        enhancedTargets={enhancedTargets}
      />
    );
  }

  console.log(targets);
  console.log(enhancedTargets);

  if (!targets.length) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <Typography>Add a target to get started</Typography>
          <Button
            type="button"
            variant="contained"
            sx={{mt: 3, mb: 2}}
            onClick={() => setShowAddTargetForm(true)}
          >
            Add target
          </Button>
        </Box>
      </>
    );
  }

  if (currenTarget) {
    return (
      <UpdateTargetForm
        currentTarget={currenTarget}
        setCurrentTarget={setCurrentTarget}
      />
    );
  }

  return (
    <TargetsTable
      setCurrentTarget={setCurrentTarget}
      setShowAddTargetForm={setShowAddTargetForm}
    />
  );
};

export default Targets;
