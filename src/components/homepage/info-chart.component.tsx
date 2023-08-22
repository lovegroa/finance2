import {FC, useEffect, useState} from 'react';
import LineChart from '../generic/line-chart.component';
import {Box, Typography, Slider} from '@mui/material';
import {useAppSelector} from '../../utils/hooks/hooks.utils';
import {selectAccounts, selectformatter} from '../../store/user/user.slice';
import {
  EnhancedTargets,
  generateLabels,
} from '../../utils/general/general.utils';
import {ChartDataset, Point} from 'chart.js';

type ChildProps = {
  currentTarget: EnhancedTargets;
};

export const InfoChart: FC<ChildProps> = ({currentTarget}) => {
  const {format} = useAppSelector(selectformatter);
  const accounts = useAppSelector(selectAccounts);

  const [sliderValue, setSliderValue] = useState<number>(1);

  const {balanceBegin, days, balanceDisposable, balanceEnd, cashPerDay} =
    currentTarget.total;
  const maxBalanceEnd = balanceDisposable + balanceEnd;

  const newBalanceEnd = maxBalanceEnd * sliderValue;
  const balanceDisposableDelta = balanceEnd - newBalanceEnd;
  const cpdDelta = balanceDisposableDelta / days;
  const cpd = cashPerDay + cpdDelta;

  const labels = generateLabels(
    currentTarget.total.dateEnd,
    currentTarget.total.dateBegin
  );

  useEffect(() => {
    setSliderValue(balanceEnd / maxBalanceEnd);
  }, [currentTarget]);

  function sliderHandler(event: Event, value: number | number[]) {
    if (typeof value !== 'number') return;
    setSliderValue(Number(value));
  }

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

  return (
    <>
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
    </>
  );
};

export default InfoChart;
