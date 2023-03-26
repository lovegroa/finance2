// packages
import {useState, FormEvent, ChangeEvent, useEffect} from 'react';
import {Link} from 'react-router-dom';

//utilities

//components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Icon from '../assets/icon.png';
import {signInWithGoogleRedirect} from '../utils/firebase/firebase.utils';
import {actionGoogleSignIn, actionSignIn} from '../store/user/user.action';
import {useAppDispatch, useAppSelector} from '../utils/hooks/hooks.utils';
import {selectSignInLoading} from '../store/user/user.slice';
import Spinner from '../components/generic/spinner.component';

const defaultFormFields = {
  email: '',
  password: '',
};

export default function SignIn() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {email, password} = formFields;
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSignInLoading);

  useEffect(() => {
    // for the google login redirect
    const getRedirectResultAsync = async () => {
      await dispatch(actionGoogleSignIn());
    };
    getRedirectResultAsync();
  }, []);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(actionSignIn(email, password));
    resetFormFields();

    // try {
    //   console.log('sign in with u and p');
    //   const response = await signInAuthUserWithEmailAndPassword(
    //     email,
    //     password
    //   );
    //   console.log(response);
    //   if (response) {
    //     dispatch(setCurrentUserAction(response.user) as any);
    //     resetFormFields();
    //   }
    // } catch (error) {
    //   if (error instanceof FirebaseError) {
    //     switch (error.code) {
    //       case 'auth/wrong-password':
    //         alert('Incorrect password');
    //         break;
    //       case 'auth/user-not-found':
    //         alert('User not found');
    //         break;
    //       default:
    //         console.log('user sign in failed', error.message);
    //     }
    //   } else {
    //     console.log('user sign in failed', error);
    //   }
    // }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Avatar src={Icon} sx={{m: 1, bgcolor: 'secondary.main'}}></Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{mt: 3}}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
                Login
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/sign-up">
                    <Typography variant="body2">
                      Don't have an account yet? Sign up
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Button
              onClick={signInWithGoogleRedirect}
              type="button"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Sign in with Google
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
