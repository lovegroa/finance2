//mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

//firebase
import {getRedirectResult} from 'firebase/auth';

//local imports
import Icon from '../assets/icon.png';
import {
  auth,
  CreateUserDocumentFromAuth,
  signInWithGoogleRedirect,
} from '../utils/firebase/firebase.utils';

//package imports
import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
// import {createUser} from '../store/user/user.action';

export default function SignUp() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getRedirectResultAsync = async () => {
      const response = await getRedirectResult(auth);
      if (response) {
        const userDocRef = await CreateUserDocumentFromAuth(response.user);
        console.log(userDocRef);
      }
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
    // dispatch(createUser(email, password, name) as any);

    resetFormFields();

    // try {
    //   const response = await createAuthUserWithEmailAndPassword(
    //     email,
    //     password
    //   );
    //   if (response) {
    //     await CreateUserDocumentFromAuth(response.user, {name: name});
    //     resetFormFields();
    //   }
    // } catch (error) {
    //   if (error instanceof FirebaseError) {
    //     switch (error.code) {
    //       case 'auth/email-already-in-use':
    //         alert('Email address is already in use.');
    //         break;
    //       case 'auth/invalid-email':
    //         alert('Email address is not valid.');
    //         break;
    //       case 'auth/weak-password':
    //         alert('Password is too weak.');
    //         break;
    //       default:
    //         console.log('Error creating user:', error.message);
    //     }
    //   } else {
    //     console.log('User creation error:', error);
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
            Sign in with Google
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
