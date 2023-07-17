import Navigation from '../components/navigation/navigation.component';
import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {
  selectAccounts,
  selectEnhancedTargets,
  selectIsUserDataLoading,
  selectformatter,
} from '../store/user/user.slice';
import TransactionsTable from '../components/homepage/transactions-table.component';
import {useEffect, useState} from 'react';
import {generateLabels} from '../utils/general/general.utils';
import LineChart from '../components/generic/line-chart.component';
import {ChartDataset, Point} from 'chart.js';
import {useNavigate} from 'react-router-dom';

const Homepage: React.FC = () => {
  const {format} = useAppSelector(selectformatter);
  const targets = useAppSelector(selectEnhancedTargets);
  const accounts = useAppSelector(selectAccounts);
  const [currentTargetId, setCurrentTargetId] = useState(targets[0]?._id);
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectIsUserDataLoading);
  const [sliderValue, setSliderValue] = useState<number>(1);

  useEffect(() => {
    if (!targets.length && !isLoading) {
      console.log('here');
      navigate('/targets');
    }
  }, [targets]);

  if (!targets.length) {
    return <></>;
  }
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
  const updateTarget = (event: SelectChangeEvent<string>) => {
    setCurrentTargetId(
      targets.filter(({_id}) => _id === event.target.value)[0]._id
    );
  };

  const labels = generateLabels(
    currentTarget.total.dateEnd,
    currentTarget.total.dateBegin
  );

  const {balanceBegin, days, balanceDisposable, balanceEnd, cashPerDay} =
    currentTarget.total;
  const maxBalanceEnd = balanceDisposable + balanceEnd;

  useEffect(() => {
    setSliderValue(balanceEnd / maxBalanceEnd);
  }, [currentTargetId]);

  const newBalanceEnd = maxBalanceEnd * sliderValue;
  const balanceDisposableDelta = balanceEnd - newBalanceEnd;
  const cpdDelta = balanceDisposableDelta / days;
  const cpd = cashPerDay + cpdDelta;

  const updateDataset = (item: number, i: number) => {
    return item + (cashPerDay - cpd) * i;
  };

  let datasets: ChartDataset<'line', (number | Point | null)[]>[] = [
    {
      label: 'Total',
      data: currentTarget.total.dataset.map(updateDataset),
      fill: true,
      backgroundColor: 'rgba(44,24,47,0.2)',
      borderColor: 'rgba(44,24,47,1)',
    },
  ];

  datasets = datasets.concat(
    currentTarget.accounts.map(({name, dataset, id}) => {
      if (!id) throw new Error();
      const {color, isPriority} = accounts.filter(
        account => account.id === id
      )[0];

      return {
        label: name,
        data: isPriority ? dataset.map(updateDataset) : dataset,
        fill: true,
        backgroundColor: `${color}33`,
        borderColor: `${color}`,
      };
    })
  );

  function sliderHandler(event: Event, value: number | number[]) {
    if (typeof value !== 'number') return;
    setSliderValue(Number(value));
  }

  if (!currentTargetId) {
    return <></>;
  }

  const TargetStatus = () => {
    if (targets.findIndex(({_id}) => _id === currentTargetId)) {
      return <Chip label={'Not started'} color="secondary"></Chip>;
    }
    return <Chip label={'Active'} color="primary" />;
  };

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '1rem',
          }}
        >
          <TargetStatus />
          <FormControl>
            <Select
              value={currentTargetId}
              onChange={updateTarget}
              inputProps={{'aria-label': 'Without label'}}
            >
              {targets.map(target => {
                return (
                  <MenuItem key={target._id} value={target._id}>
                    {target.total.dateBegin.toLocaleDateString()} -{' '}
                    {target.total.dateEnd.toLocaleDateString()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <LineChart labels={labels} datasets={datasets} />
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography>Start Balance</Typography>
            <Typography> {format(balanceBegin)}</Typography>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography> {days} Days</Typography>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography>End Balance</Typography>
            <Typography> {format(newBalanceEnd)}</Typography>
          </Box>
        </Box>

        <Slider
          aria-label="CPD"
          defaultValue={0}
          valueLabelDisplay="auto"
          value={sliderValue}
          step={0.001}
          //   marks
          min={0}
          max={1}
          onChange={sliderHandler}
        />

        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography>Cash per day</Typography>
            <Typography> {format(cpd)}</Typography>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography>Cash per week</Typography>
            <Typography> {format(cpd * 7)}</Typography>
          </Box>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Typography>Cash per month</Typography>
            <Typography> {format((cpd * 365) / 12)}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Homepage;
