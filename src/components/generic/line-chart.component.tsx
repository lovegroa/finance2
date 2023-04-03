import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  Point,
  registerables,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
Chart.register(...registerables);
import 'chartjs-adapter-date-fns';
import {enGB} from 'date-fns/locale';
import {FC} from 'react';

type ChildProps = {
  labels: Date[];
  datasets: ChartDataset<'line', (number | Point | null)[]>[];
};

const LineChart: FC<ChildProps> = ({labels, datasets}) => {
  const data: ChartData<'line'> = {
    labels: labels,
    datasets: datasets,
  };

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',

        // add this:
        adapters: {
          date: {
            locale: enGB,
          },
        },
      },
      y: {
        suggestedMin: 0,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
