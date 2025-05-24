import React, { useState, useContext } from 'react';
import { Box, Button, Container, TextField, Typography, Link, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Components/AuthContext';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setRol } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasenia }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión');
      } else {
        setRol(data.rol); // Guarda el rol en el contexto
        navigate('/visualiza'); // Redirige a VisualizaPage
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

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

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              type="text"
              label="Nombre usuario"
              fullWidth
              variant="outlined"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
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
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
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

            {error && <Typography color="error">{error}</Typography>}

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
              type="submit"
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
        </form>
      </Paper>
    </Container>
  );
};

export default Login;