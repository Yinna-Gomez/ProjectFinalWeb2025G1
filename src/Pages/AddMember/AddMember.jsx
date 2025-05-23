import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';

const AddMember = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: '',
    idNumber: '',
    grade: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Integrante agregado:", formData);
  };

  return (
    <Container sx={{ minHeight: '100vh', py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Agregar integrante
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Apellidos"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Identificación</InputLabel>
            <Select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              label="Identificación"
            >
              <MenuItem value="cc">Cédula de Ciudadanía</MenuItem>
              <MenuItem value="ti">Tarjeta de Identidad</MenuItem>
              <MenuItem value="ce">Cédula de Extranjería</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Número Identificación"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Grado escolar</InputLabel>
            <Select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              label="Grado escolar"
            >
              {[...Array(11)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{`${i + 1}°`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              variant="contained"
              color="warning"
              sx={{ border: '1px solid black', color: 'white' }}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              sx={{ border: '1px solid black', color: 'white' }}
            >
              Agregar integrante
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMember;