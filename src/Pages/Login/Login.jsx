import React from 'react';
import { Box, Button, Container, TextField, Typography, Link, Stack, Paper } from '@mui/material';

const Login = () => {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'inherit', // asegura heredar Montserrat
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: '100%', bgcolor: 'var(--color-surface)' }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          textAlign="center"
          sx={{ color: 'var(--color-primary)' }}
        >
          Iniciar sesión
        </Typography>

        <Typography variant="body2" textAlign="center" mb={2} sx={{ color: 'var(--color-muted)' }}>
          ¿No tienes una cuenta?{' '}
          <Link
            href="#"
            sx={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--color-accent)',
                textDecoration: 'underline',
              },
            }}
          >
            Regístrate
          </Link>
        </Typography>

        <Stack spacing={2}>
          <TextField
            type="email"
            label="Correo"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--color-text)',
                '& fieldset': {
                  borderColor: 'var(--color-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
              input: { fontFamily: 'inherit' },
            }}
          />
          <TextField
            type="password"
            label="Contraseña"
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'var(--color-text)',
                '& fieldset': {
                  borderColor: 'var(--color-border)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-primary)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary)',
                },
              },
              input: { fontFamily: 'inherit' },
            }}
          />

          <Box textAlign="right">
            <Link
              href="#"
              variant="body2"
              sx={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                '&:hover': {
                  color: 'var(--color-accent)',
                  textDecoration: 'underline',
                },
              }}
            >
              ¿Has olvidado la contraseña?
            </Link>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: 'var(--color-accent)',
              color: 'white',
              '&:hover': {
                bgcolor: 'var(--color-primary)',
              },
              fontWeight: 600,
            }}
          >
            Iniciar Sesión
          </Button>
        </Stack>

        <Typography
          variant="body2"
          align="center"
          mt={4}
          mb={2}
          sx={{ color: 'var(--color-muted)' }}
        >
          O conéctate con
        </Typography>

        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#126083',
              '&:hover': { bgcolor: '#0e4c66' },
              fontWeight: 600,
            }}
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
            sx={{
              fontWeight: 600,
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-hover)',
              },
            }}
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