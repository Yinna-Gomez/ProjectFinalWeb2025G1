import React from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import './CronogramaModal.css';

const CronogramaModal = ({ open, onClose, onAdd, actividad, setActividad }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="cronograma-modal-box">
        <Typography variant="h6" sx={{ mb: 2 }}>Agregar Actividad</Typography>
        <TextField
          fullWidth
          label="Actividad"
          name="actividad"
          value={actividad.actividad}
          onChange={e => setActividad({ ...actividad, actividad: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Fecha inicio"
          name="fechainicio"
          type="date"
          value={actividad.fechainicio}
          onChange={e => setActividad({ ...actividad, fechainicio: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Fecha fin"
          name="fechafin"
          type="date"
          value={actividad.fechafin}
          onChange={e => setActividad({ ...actividad, fechafin: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
          <Button variant="contained" className="visualiza-btn" onClick={onAdd}>Agregar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CronogramaModal; 