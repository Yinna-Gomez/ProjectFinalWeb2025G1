import React from 'react';
import {Box,Button,Container,TextField,Typography,Link,Stack,Paper
} from '@mui/material';

const Login = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          Iniciar sesión
        </Typography>

        <Typography variant="body2" textAlign="center" mb={2}>
          ¿No tienes una cuenta? <Link href="#">Regístrate</Link>
        </Typography>

        <Stack spacing={2}>
          <TextField type="email" label="Correo" fullWidth variant="outlined" />
          <TextField type="password" label="Contraseña" fullWidth variant="outlined" />

          <Box textAlign="right">
            <Link href="#" variant="body2">
              ¿Has olvidado la contraseña?
            </Link>
          </Box>

          <Button variant="contained" fullWidth sx={{ bgcolor: 'warning.main' }}>
            Iniciar Sesión
          </Button>
        </Stack>

        <Typography variant="body2" align="center" mt={4} mb={2}>
          O conéctate con
        </Typography>

        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: '#126083' }}
            startIcon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook"
                style={{ width: 20, height: 20 }}
              />
            }
          >
            Facebook
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
            }
          >
            Google
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;