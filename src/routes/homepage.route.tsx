import Navigation from '../components/navigation/navigation.component';
import {Box, Container, Unstable_Grid2 as Grid} from '@mui/material';

const Homepage: React.FC = () => {
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
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <div
                style={{
                  height: '100px',
                  width: '100px',
                  backgroundColor: 'red',
                }}
              ></div>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <div
                style={{
                  height: '100px',
                  width: '100px',
                  backgroundColor: 'red',
                }}
              ></div>
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <div
                style={{
                  height: '100px',
                  width: '100px',
                  backgroundColor: 'red',
                }}
              ></div>
            </Grid>
            <Grid xs={12} sm={6} lg={3}></Grid>
            <Grid xs={12} lg={8}></Grid>
            <Grid xs={12} md={6} lg={4}>
              <div
                style={{
                  height: '100px',
                  width: '100px',
                  backgroundColor: 'red',
                }}
              ></div>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <div
                style={{
                  height: '100px',
                  width: '100px',
                  backgroundColor: 'red',
                }}
              ></div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Homepage;
