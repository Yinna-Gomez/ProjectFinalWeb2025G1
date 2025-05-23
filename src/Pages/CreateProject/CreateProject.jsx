import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material';

const CreateProject = () => {
  const [project, setProject] = useState({
    title: '',
    budget: '',
    area: '',
    educationalInstitution: '',
    objectives: '',
    cronogram: '',
    notes: ''
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    await saveProject(project);
  };

  return (
    <Container sx={{ minHeight: '100vh', py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Crear Proyecto
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={project.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Presupuesto"
              name="budget"
              value={project.budget}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Área"
              name="area"
              value={project.area}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institución Educativa"
              name="educationalInstitution"
              value={project.educationalInstitution}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Objetivos"
              name="objectives"
              value={project.objectives}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{ height: '100%' }}
              color="warning"
            >
              Agregar Integrantes
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cronograma"
              name="cronogram"
              value={project.cronogram}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
              name="notes"
              value={project.notes}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box mt={4} textAlign="right">
          <Button
            variant="contained"
            color="warning"
            onClick={handleSubmit}
            sx={{ border: '1px solid black', color: 'black' }}
          >
            Crear Proyecto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProject;