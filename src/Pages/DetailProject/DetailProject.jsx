import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';

const DetailProject = () => {
  const projectDetails = {
    title: 'Título del proyecto 1',
    status: 'Formulación',
    area: 'Área del proyecto',
    objectives: 'Objetivos del proyecto',
    cronogram: 'Cronograma del proyecto',
    budget: 'Presupuesto del proyecto',
    educationalInstitution: 'Institución Educativa del proyecto',
    members: 'Integrantes del proyecto'
  };

  const files = [
    { name: "128-ABC-00-DR-A-103-GA PLAN LEVEL 00", size: "1:100" },
    { name: "128-ABC-01-DR-A-104-GA PLAN LEVEL 01", size: "1:100" },
    { name: "128-ABC-B1-DR-A-102-GA PLAN LEVEL -0'", size: "1:100" },
    { name: "128-DEF-00-DR-S-111-LEVEL 00 DECK REF", size: "1:100" },
    { name: "128-DEF-01-DR-S-201-LEVEL 01 DECK REF", size: "1:100" },
    { name: "128-DEF-B1-DR-S-101-LEVEL B1 - PILES &", size: "1:100" },
  ];

  const images = [
    "20180329_081951.jpg",
    "20180329_121206.jpg",
    "25254688767_590039f06c_o.jpg",
    "3805645431_a3f409f4d7_o.jpg",
    "38503831555_9ae89f5c10_o.jpg",
    "DSC08899.JPG",
    "DSC08900.JPG",
    "DSC08901.JPG",
  ];

  return (
    <Container sx={{ minHeight: '100vh', py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Detalle del proyecto
        </Typography>

        <Grid container spacing={4}>
          {/* Detalles del Proyecto */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Información</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {Object.entries(projectDetails).map(([key, value]) => (
                <Typography key={key} variant="body1" fontWeight={500}>
                  {value}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Archivos */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Archivos</Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper variant="outlined" sx={{ maxHeight: 240, overflowY: 'auto', p: 2 }}>
              <List dense>
                {files.map((file, index) => (
                  <ListItem key={index} button>
                    <ListItemIcon>
                      <PictureAsPdfIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`PDF, Escala ${file.size}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Imágenes */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Imágenes</Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper variant="outlined" sx={{ maxHeight: 240, overflowY: 'auto', p: 2 }}>
              <List dense>
                {images.map((image, index) => (
                  <ListItem key={index} button>
                    <ListItemIcon>
                      <ImageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={image} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Botón Volver */}
        <Box textAlign="center" mt={6}>
          <Button variant="contained" sx={{ bgcolor: 'warning.main' }}>
            Volver
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailProject;