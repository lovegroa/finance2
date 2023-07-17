//mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

//local imports
import Icon from '../assets/icon.png';
import {signInWithGoogleRedirect} from '../utils/firebase/firebase.utils';

//package imports
import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {actionCreateUser, actionGoogleSignIn} from '../store/user/user.action';
import {useAppDispatch} from '../utils/hooks/hooks.utils';

export default function SignUp() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // for the google login redirect
    const getRedirectResultAsync = async () => {
      await dispatch(actionGoogleSignIn());
    };
    getRedirectResultAsync();
  }, []);

  const defaultFormFields = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [formFields, setFormFields] = useState(defaultFormFields);

  const {name, email, password, confirmPassword} = formFields;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormFields({...formFields, [name]: value});
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Your passwords do not match');
      return;
    }
    dispatch(actionCreateUser(email, password));
    resetFormFields();
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
        <Avatar src={Icon} sx={{m: 1, bgcolor: 'secondary.main'}}></Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                onChange={handleChange}
                value={name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={email}
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
                value={password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="new-password"
                onChange={handleChange}
                value={confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Sign Up
          </Button>
          <Button
            onClick={signInWithGoogleRedirect}
            type="button"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            Sign up with Google
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to={'/login'}>
                <Typography variant="body2">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
