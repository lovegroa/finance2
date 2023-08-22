import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {FC} from 'react';
import {selectEnhancedTargets} from '../../store/user/user.slice';
import {useAppSelector} from '../../utils/hooks/hooks.utils';

type ChildProps = {
  currentTargetId: string;
  setCurrentTargetId: React.Dispatch<React.SetStateAction<string>>;
};

export const TargetSelect: FC<ChildProps> = ({
  currentTargetId,
  setCurrentTargetId,
}) => {
  const targets = useAppSelector(selectEnhancedTargets);

  const updateTarget = (event: SelectChangeEvent<string>) => {
    setCurrentTargetId(
      targets.filter(({_id}) => _id === event.target.value)[0]._id
    );
  };

  const TargetStatus = () => {
    if (targets.findIndex(({_id}) => _id === currentTargetId)) {
      return <Chip label={'Not started'} color="secondary"></Chip>;
    }
    return <Chip label={'Active'} color="primary" />;
  };

  return (
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
  );
};
