import Navigation from '../components/navigation/navigation.component';
import {Box, Paper} from '@mui/material';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {
  selectEnhancedTargets,
  selectIsUserDataLoading,
} from '../store/user/user.slice';
import TransactionsTable from '../components/homepage/transactions-table.component';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import InfoChart from '../components/homepage/info-chart.component';
import {TargetSelect} from '../components/homepage/target-select.component';

const Homepage: React.FC = () => {
  const targets = useAppSelector(selectEnhancedTargets);
  const [currentTargetId, setCurrentTargetId] = useState(targets[0]?._id);
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUserDataLoading);

  useEffect(() => {
    if (!targets.length && !isLoading) {
      navigate('/targets');
    }
  }, [targets]);

  if (!targets.length) return <></>;

  const currentTarget = targets.filter(
    target => target._id === currentTargetId
  )[0];

  const validTarget = !!targets.filter(target => target._id === currentTargetId)
    .length;

  if (!validTarget) {
    setCurrentTargetId(targets[0]._id);
    return (
      <div className="container">
        <Navigation></Navigation>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <p>Target not found</p>
        </Box>
      </div>
    );
  }

  if (!currentTargetId) return <></>;

  return (
    <Box
      sx={{display: 'flex', justifyContent: 'space-between', height: '100%'}}
    >
      <Paper
        sx={{
          width: '45%',
          padding: '20px',
          height: '100%',
          mr: '0.5rem',
        }}
      >
        <TransactionsTable targetId={currentTargetId} />
      </Paper>
      <Paper sx={{width: '55%', padding: '20px', ml: '0.5rem'}}>
        <TargetSelect
          currentTargetId={currentTargetId}
          setCurrentTargetId={setCurrentTargetId}
        />
        <InfoChart currentTarget={currentTarget} />
      </Paper>
    </Box>
  );
};

export default Homepage;
