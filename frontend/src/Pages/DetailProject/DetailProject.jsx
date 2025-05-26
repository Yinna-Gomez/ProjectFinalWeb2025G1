import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaFilePdf } from 'react-icons/fa';
import './DetailProject.css';
import { AuthContext } from '../../Components/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DetailProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rol } = useContext(AuthContext);
  const [proyecto, setProyecto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarProyecto = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/proyectos/${id}`, {
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
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarProyecto();
    } else {
      navigate('/visualiza');
    }
  }, [id, navigate]);

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

  const generarPDF = async () => {
    try {
      setLoadingPdf(true);
      setMensaje('');
      const content = contentRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.setFontSize(20);
      pdf.text('Reporte de Proyecto', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generado el: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`, 105, 30, { align: 'center' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 40, imgWidth, imgHeight);
      pdf.save(`Proyecto_${proyecto.titulo.replace(/\s+/g, '_')}.pdf`);
      setMensaje('¡PDF generado correctamente!');
    } catch (error) {
      setError('Error al generar el PDF. Intenta nuevamente.');
    } finally {
      setLoadingPdf(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!proyecto) {
    return <div className="error">No se encontró el proyecto</div>;
  }

  return (
    <div className="detail-project-container">
      <div className="detail-project-header">
        <h1>{proyecto.titulo}</h1>
        <button 
          className="btn-generar-pdf" 
          onClick={generarPDF}
          disabled={loadingPdf}
        >
          {loadingPdf ? 'Generando PDF...' : (
            <>
              <FaFilePdf /> Generar Reporte PDF
            </>
          )}
        </button>
      </div>
      
      <div className="detail-project-content" ref={contentRef}>
        <Container sx={{ minHeight: '100vh', py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/visualiza')}
            >
              Volver
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 4, backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'var(--color-primary)' }}>
              {proyecto.titulo}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="detail-label" gutterBottom>Información General</Typography>
                <Stack spacing={2}>
                  <Box>
                    <span className="detail-label">Área:</span>
                    <span className="detail-value"> {proyecto.area}</span>
                  </Box>
                  <Box>
                    <span className="detail-label">Institución:</span>
                    <span className="detail-value"> {proyecto.institucion}</span>
                  </Box>
                  <Box>
                    <span className="detail-label">Presupuesto:</span>
                    <span className="detail-value"> {proyecto.presupuesto}</span>
                  </Box>
                  <Box>
                    <span className="detail-label">Estado:</span>
                    <Chip 
                      label={proyecto.estado || 'No definido'} 
                      color={proyecto.estado === 'activo' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="detail-label" gutterBottom>Objetivos</Typography>
                <Typography className="detail-value" paragraph>{proyecto.objetivos}</Typography>
                
                {proyecto.observaciones && (
                  <>
                    <Typography variant="h6" className="detail-label" gutterBottom sx={{ mt: 3 }}>Observaciones</Typography>
                    <Typography className="detail-value" paragraph>{proyecto.observaciones}</Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" className="detail-label" gutterBottom>Integrantes</Typography>
                <List>
                  {proyecto.integrantes?.map((integrante, index) => (
                    <ListItem key={index}>
                      <span className="detail-label">{integrante.nombre} {integrante.apellido}</span>
                      <span className="detail-value" style={{ marginLeft: 8 }}>{integrante.correo}</span>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {proyecto.archivos && proyecto.archivos.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>Archivos Adjuntos</Typography>
                  <List>
                    {proyecto.archivos.map((archivo, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getIconByFileType(archivo.tipo)}
                        </ListItemIcon>
                        <ListItemText
                          primary={archivo.nombre}
                          secondary={new Date(archivo.fecha).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {proyecto.historialestado && proyecto.historialestado.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" className="detail-label" gutterBottom>Historial de Estados</Typography>
                  <List>
                    {proyecto.historialestado.map((historial, index) => (
                      <ListItem key={index}>
                        <span className="detail-label">Estado:</span>
                        <span className="detail-value"> {historial.estado}</span>
                        {historial.observacion && (
                          <span className="detail-value" style={{ marginLeft: 8 }}>
                            Observación: {historial.observacion}
                          </span>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Mostrar avances del proyecto */}
              {proyecto.avances && proyecto.avances.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" className="detail-label" gutterBottom>Avances del Proyecto</Typography>
                  <List>
                    {proyecto.avances.map((avance, index) => (
                      <ListItem key={index} alignItems="flex-start">
                        <span className="detail-label">
                          <strong>{avance.creadoPor}</strong> - {new Date(avance.fecha).toLocaleDateString()}
                        </span>
                        <span className="detail-value">
                          {avance.descripcion}
                          {avance.archivos && avance.archivos.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <strong>Archivos:</strong>
                              <ul>
                                {avance.archivos.map((archivo, idx) => (
                                  <li key={idx}>
                                    <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                                      {archivo.nombre}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </span>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              {/* Botón de registrar avance para integrantes */}
              {rol === 'integrante' && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/seguimiento?id=${proyecto._id}`)}
                    className="btn-registrar-avance"
                    fullWidth
                  >
                    Registrar Avance
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Container>
      </div>
      {mensaje && <div style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: 8 }}>{mensaje}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default DetailProject;