import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  ListItemText,
  Chip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import './DetailProject.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DetailProject = () => {
  const [proyecto, setProyecto] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const proyectoId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const cargarProyecto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/proyectos/${proyectoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el proyecto');
        }
        
        const data = await response.json();
        setProyecto(data);
      } catch (error) {
        setError('Error al cargar el proyecto');
        console.error(error);
      }
    };

    if (proyectoId) {
      cargarProyecto();
    } else {
      navigate('/visualiza');
    }
  }, [proyectoId, navigate]);

  const getIconByFileType = (tipo) => {
    const extension = tipo.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
      return <ImageIcon />;
    } else if (extension === '.pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };

  if (!proyecto) {
    return (
      <Container sx={{ minHeight: '100vh', py: 6 }}>
        <Typography variant="h5" align="center">Cargando proyecto...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ minHeight: '100vh', py: 6 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/visualiza')}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'var(--color-primary)' }}>
          {proyecto.titulo}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Información General</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" color="var(--color-secondary)">Estado</Typography>
                <Chip 
                  label={proyecto.estado.toUpperCase()} 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" color="var(--color-secondary)">Área</Typography>
                <Typography>{proyecto.area}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="var(--color-secondary)">Institución</Typography>
                <Typography>{proyecto.institucion}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="var(--color-secondary)">Objetivos</Typography>
                <Typography>{proyecto.objetivos}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="var(--color-secondary)">Presupuesto</Typography>
                <Typography>{proyecto.presupuesto}</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Integrantes</Typography>
            <List>
              {proyecto.integrantes.map((integrante, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${integrante.nombre} ${integrante.apellido}`}
                    secondary={`${integrante.tipoidentificacion}: ${integrante.identificacion} - Grado: ${integrante.gradoEscolar}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom sx={{ color: 'var(--color-primary)' }}>
          Avances del Proyecto
        </Typography>

        {proyecto.avances && proyecto.avances.length > 0 ? (
          proyecto.avances.map((avance, index) => (
            <Paper 
              key={index} 
              elevation={1} 
              sx={{ 
                p: 3, 
                mt: 2, 
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" color="var(--color-muted)">
                  {new Date(avance.fecha).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle2" color="var(--color-muted)">
                  Por: {avance.creadoPor}
                </Typography>
              </Box>

              <Typography paragraph>{avance.descripcion}</Typography>

              {avance.archivos && avance.archivos.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'var(--color-secondary)' }}>
                    Archivos adjuntos:
                  </Typography>
                  <Grid container spacing={1}>
                    {avance.archivos.map((archivo, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Paper
                          sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                              backgroundColor: 'var(--color-border)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {getIconByFileType(archivo.tipo)}
                          </ListItemIcon>
                          <a
                            href={archivo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {archivo.nombre}
                          </a>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>
          ))
        ) : (
          <Typography 
            align="center" 
            sx={{ 
              my: 4, 
              color: 'var(--color-muted)',
              fontStyle: 'italic'
            }}
          >
            No hay avances registrados aún.
          </Typography>
        )}

        {/* Botón para registrar avance (solo visible para integrantes) */}
        {proyecto.integrantes && proyecto.integrantes.some(i => 
          i.correo?.toLowerCase() === localStorage.getItem('correo')?.toLowerCase()
        ) && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/seguimiento?id=${proyectoId}`)}
              sx={{
                backgroundColor: 'var(--color-primary)',
                '&:hover': {
                  backgroundColor: 'var(--color-accent)'
                }
              }}
            >
              Registrar Avance
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DetailProject;