import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import './AddMember.css';

const AddMember = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: '',
    idNumber: '',
    grade: '',
    correo: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar todos los campos
    if (!formData.firstName || !formData.lastName || !formData.idType || !formData.idNumber || !formData.grade || !formData.correo) {
      setError('Todos los campos son obligatorios');
      alert('Todos los campos son obligatorios');
      return;
    }
    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Correo electrónico inválido');
      alert('Correo electrónico inválido');
      return;
    }
    setError('');
    onAdd(formData);
    setFormData({ firstName: '', lastName: '', idType: '', idNumber: '', grade: '', correo: '' });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderRadius: 3
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ color: 'var(--color-primary)', fontWeight: 600 }}
      >
        Agregar integrante
      </Typography>
      {error && <div style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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
        <TextField
          fullWidth
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#2c80c9'
              },
              px: 3,
              py: 1,
              borderRadius: 2
            }}
            onClick={onCancel}
            type="button"
          >
            Volver
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#0056b3'
              },
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            Agregar integrante
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AddMember;