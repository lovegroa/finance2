import './App.css';
import SignUp from './routes/sign-up.route';
import {ThemeProvider} from '@mui/material/styles';
import {Route, Routes} from 'react-router-dom';
import Homepage from './routes/homepage.route';
import SignIn from './routes/sign-in.route';
import {defaultTheme} from './utils/themes/default.theme';
import Accounts from './routes/accounts.route';
import {useAppSelector} from './utils/hooks/hooks.utils';
import {selectLoggedIn} from './store/user/user.slice';
import Transactions from './routes/transactions.route';
import Targets from './routes/targets.route';
import Navigation from './components/navigation/navigation.component';
import {Box} from '@mui/material';

function App() {
  const userIsLoggedIn = useAppSelector(selectLoggedIn);

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Navigation />
        <Box
          sx={{
            height: 'calc(100vh - 60px)',
            width: '100vw',
            overflow: 'auto',
            p: '1rem',
          }}
        >
          <Box component="main" sx={{height: '100%'}}>
            <Routes>
              {userIsLoggedIn ? (
                <>
                  <Route path="/accounts" element={<Accounts />}></Route>
                  <Route
                    path="/transactions"
                    element={<Transactions />}
                  ></Route>
                  <Route path="/targets" element={<Targets />}></Route>
                  <Route path="/" element={<Homepage />}></Route>
                  <Route path="*" element={<Homepage />}></Route>
                </>
              ) : (
                <>
                  <Route path="/sign-up" element={<SignUp />}></Route>
                  <Route path="/sign-in" element={<SignIn />}></Route>
                  <Route path="*" element={<SignIn />}></Route>
                </>
              )}
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
