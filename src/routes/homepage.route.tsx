import Navigation from '../components/navigation/navigation.component';
import {Box, Container} from '@mui/material';
import LineChart from '../components/generic/line-chart.component';
import {useAppSelector} from '../utils/hooks/hooks.utils';
import {
  selectAccounts,
  selectTransactions,
  selectUsedCurrencies,
} from '../store/user/user.slice';
import {ChartDataset, Point} from 'chart.js';
import {
  generateDatasets,
  generateLabels,
  hexToRgb,
} from '../utils/general/general.utils';

const Homepage: React.FC = () => {
  const accounts = useAppSelector(selectAccounts);
  const transactions = useAppSelector(selectTransactions);
  const usedCurrencies = useAppSelector(selectUsedCurrencies);
  const targetDate = new Date('2024-04-24');
  const labels: Date[] = generateLabels(targetDate);
  const datasets: ChartDataset<'line', (number | Point | null)[]>[] =
    generateDatasets(labels, accounts, transactions);

  const displayData = usedCurrencies.map(currency => {
    const datasets: ChartDataset<'line', (number | Point | null)[]>[] =
      generateDatasets(
        labels,
        accounts.filter(account => account.currency === currency),
        transactions
      );

    const initialTotals = new Array(labels.length).fill(0);

    const totalData = datasets.reduce<number[]>((acc, dataset) => {
      dataset.data.forEach((dataPoint, index) => {
        if (!dataPoint) return;
        if (typeof dataPoint !== 'number') return;
        acc[index] += dataPoint;
        return acc;
      });
      return acc;
    }, initialTotals);

    const result = hexToRgb('#2c182f');

    return {
      accounts: datasets,
      total: [
        {
          label: currency,
          data: totalData,
          fill: true,
          backgroundColor: `rgba(${result?.r},${result?.g},${result?.b},0.2)`,
          borderColor: `rgba(${result?.r},${result?.g},${result?.b},1)`,
        },
      ],
    };
  });

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
        {displayData.map(({total, accounts}) => {
          return (
            <>
              <LineChart labels={labels} datasets={accounts} />
              <LineChart labels={labels} datasets={total} />
            </>
          );
        })}
        <LineChart labels={labels} datasets={datasets} />
        <Container maxWidth="xl"></Container>
      </Box>
    </div>
  );
};

export default Homepage;
