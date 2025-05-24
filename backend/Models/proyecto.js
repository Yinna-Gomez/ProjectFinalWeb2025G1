import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  estado: { type: String, enum: ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'], default: 'formulacion' },
  observacion: { type: String, default: '' },
  // Puedes agregar más campos según tu modelo de datos
  // ejemplo: area, objetivos, cronograma, presupuesto, institucionEducativa, integrantes, etc.
}, { collection: 'proyectos' });

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;
