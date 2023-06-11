import Navigation from '../components/navigation/navigation.component';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
// import LineChart from '../components/generic/line-chart.component';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {
  selectCurrency,
  selectEnhancedTargets,
  selectformatter,
} from '../store/user/user.slice';
// import {selectCashPerDay, selectDisplayData} from '../store/user/user.slice';
// import {generateLabels} from '../utils/general/general.utils';
// import {Fragment, useEffect, useState} from 'react';
import TransactionsTable from '../components/homepage/transactions-table.component';
import {Fragment, useEffect, useState} from 'react';
import {
  convertDateToString,
  generateLabels,
} from '../utils/general/general.utils';
import LineChart from '../components/generic/line-chart.component';
import {ChartDataset, Point} from 'chart.js';

// const copy = (value: unknown) => {
//   return JSON.parse(JSON.stringify(value));
// };

const Homepage: React.FC = () => {
  const {format} = useAppSelector(selectformatter);
  const targets = useAppSelector(selectEnhancedTargets);
  const [currentTargetId, setCurrentTargetId] = useState(targets[0]?._id);

  if (!targets.length)
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
          <p>No targets exist</p>
        </Box>
      </div>
    );

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
  let datasets: ChartDataset<'line', (number | Point | null)[]>[] = [
    {
      label: 'Total',
      data: currentTarget.total.dataset,
      fill: true,
      //   backgroundColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},0.2)`,
      //   borderColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},1)`,
    },
  ];

  datasets = datasets.concat(
    currentTarget.accounts.map(account => {
      return {
        label: account.name,
        data: account.dataset,
        fill: true,
        //   backgroundColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},0.2)`,
        //   borderColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},1)`,
      };
    })
  );

  console.log(datasets);

  //   dataset: {
  //     label: account.name,
  //     data: generateAccountData(account, accountListTransactions, dates),
  //     fill: true,
  //     backgroundColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},0.2)`,
  //     borderColor: `rgba(${accountColor.r},${accountColor.g},${accountColor.b},1)`,
  //   }

  //   const originalDisplayData = useAppSelector(selectDisplayData);
  //   const targetDate = new Date('2023-07-24');
  //   const displayData = copy(originalDisplayData) as typeof originalDisplayData;
  //   const labels: Date[] = generateLabels(targetDate, new Date());
  //   const cashPerDay = useAppSelector(selectCashPerDay);
  //   const [sliderValue, setSliderValue] = useState<number>(1);
  //   const defaultCurrency = displayData.length ? displayData[0].currency : null;
  //   const [currencyState, setCurrencyState] = useState<string | null>(
  //     defaultCurrency
  //   );

  //   const [cpd, setCpd] = useState({...cashPerDay});
  //   useEffect(() => {
  //     setCpd({...cashPerDay});
  //   }, [cashPerDay]);

  //   useEffect(() => {
  //     if (currencyState) return;
  //     const defaultCurrency = displayData.length ? displayData[0].currency : null;
  //     setCurrencyState(defaultCurrency);
  //   }, [displayData]);

  //   if (currencyState) {
  //     displayData.forEach(currencyData => {
  //       currencyData.accounts.forEach(account => {
  //         if (account.priority) {
  //           account.dataset.data = account.dataset.data.map((d, i) => {
  //             return (
  //               (d as number) - cpd[currencyData.currency].dailyAmount * (i + 1)
  //             );
  //           });
  //         }
  //       });
  //       currencyData.total[0].data = currencyData.total[0].data.map((d, i) => {
  //         return (d as number) - cpd[currencyData.currency].dailyAmount * (i + 1);
  //       });
  //     });
  //   }

  //   function sliderHandler(event: Event, value: number | number[]) {
  //     if (!currencyState) return;
  //     if (typeof value !== 'number') return;
  //     const tempCpd = JSON.parse(JSON.stringify(cashPerDay));
  //     const item = tempCpd[currencyState];
  //     item.dailyAmount = item.dailyAmount * Number(value);
  //     item.totalAmount = item.totalAmount * value;

  //     setCpd(tempCpd);

  //     setSliderValue(Number(value));
  //   }

  //   if (!currencyState) return <></>;

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
        {!currentTargetId ? (
          <></>
        ) : (
          <Container maxWidth="md">
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

            <LineChart labels={labels} datasets={datasets} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography>
                  {/* Cash Per Day: {format(cpd[currencyState].dailyAmount)} */}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  {/* Days remaining: {cpd[currencyState].numberOfDays} */}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  {/* Cash remaining:{' '}
                {formatValue(
                  cashPerDay[currencyState].totalAmount -
                    cpd[currencyState].totalAmount
                )} */}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Slider
                  aria-label="CPD"
                  defaultValue={0}
                  valueLabelDisplay="auto"
                  // value={sliderValue}
                  step={0.001}
                  //   marks
                  min={0}
                  max={1}
                  // onChange={sliderHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TransactionsTable targetId={currentTargetId} />
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
    </div>
  );
};

export default Homepage;
