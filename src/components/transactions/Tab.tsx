import {Box} from '@mui/material';

type Props = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export default function Tab({index, value, children}: Props) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
