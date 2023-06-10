import Navigation from '../components/navigation/navigation.component';
import {Box, Button, Container, Grid, Slider, Typography} from '@mui/material';
import LineChart from '../components/generic/line-chart.component';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {selectCashPerDay, selectDisplayData} from '../store/user/user.slice';
import {generateLabels} from '../utils/general/general.utils';
import {Fragment, useEffect, useState} from 'react';
import TransactionsTable from '../components/homepage/transactions-table.component';

const copy = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

const Homepage: React.FC = () => {
  const originalDisplayData = useAppSelector(selectDisplayData);
  const targetDate = new Date('2023-07-24');
  const displayData = copy(originalDisplayData) as typeof originalDisplayData;
  const labels: Date[] = generateLabels(targetDate, new Date());
  const cashPerDay = useAppSelector(selectCashPerDay);
  const [sliderValue, setSliderValue] = useState<number>(1);
  const defaultCurrency = displayData.length ? displayData[0].currency : null;
  const [currencyState, setCurrencyState] = useState<string | null>(
    defaultCurrency
  );

  const formatValue = (value: number) => {
    if (!currencyState) return;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyState,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const [cpd, setCpd] = useState({...cashPerDay});
  useEffect(() => {
    setCpd({...cashPerDay});
  }, [cashPerDay]);

  useEffect(() => {
    if (currencyState) return;
    const defaultCurrency = displayData.length ? displayData[0].currency : null;
    setCurrencyState(defaultCurrency);
  }, [displayData]);

  if (currencyState) {
    displayData.forEach(currencyData => {
      currencyData.accounts.forEach(account => {
        if (account.priority) {
          account.dataset.data = account.dataset.data.map((d, i) => {
            return (
              (d as number) - cpd[currencyData.currency].dailyAmount * (i + 1)
            );
          });
        }
      });
      currencyData.total[0].data = currencyData.total[0].data.map((d, i) => {
        return (d as number) - cpd[currencyData.currency].dailyAmount * (i + 1);
      });
    });
  }

  function sliderHandler(event: Event, value: number | number[]) {
    if (!currencyState) return;
    if (typeof value !== 'number') return;
    const tempCpd = JSON.parse(JSON.stringify(cashPerDay));
    const item = tempCpd[currencyState];
    item.dailyAmount = item.dailyAmount * Number(value);
    item.totalAmount = item.totalAmount * value;

    setCpd(tempCpd);

    setSliderValue(Number(value));
  }

  if (!currencyState) return <></>;

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
        <Container maxWidth="md">
          {displayData.map(({currency}) => (
            <Button
              key={currency}
              variant={currency === currencyState ? 'contained' : 'text'}
              onClick={() => setCurrencyState(currency)}
            >
              {currency}
            </Button>
          ))}

          {displayData.map(({total, accounts, currency}) => {
            if (currency !== currencyState) return <></>;
            return (
              <Fragment key={currency}>
                <LineChart
                  labels={labels}
                  datasets={accounts
                    .map(account => account.dataset)
                    .concat(total)}
                />
              </Fragment>
            );
          })}

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography>
                Cash Per Day: {formatValue(cpd[currencyState].dailyAmount)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                Days remaining: {cpd[currencyState].numberOfDays}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>
                Cash remaining:{' '}
                {formatValue(
                  cashPerDay[currencyState].totalAmount -
                    cpd[currencyState].totalAmount
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <TransactionsTable currencyState={currencyState} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Homepage;
