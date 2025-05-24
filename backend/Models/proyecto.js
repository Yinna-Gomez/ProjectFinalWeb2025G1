import mongoose from 'mongoose';

const integranteSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  tipoidentificacion: String,
  identificacion: String,
  gradoEscolar: String,
  correo: String,
}, { _id: false });

const actividadSchema = new mongoose.Schema({
  actividad: String,
  fechainicio: String,
  fechafin: String,
}, { _id: false });

const historialEstadoSchema = new mongoose.Schema({
  estado: String,
  fecha: String,
  observacion: String,
}, { _id: false });

const archivoSchema = new mongoose.Schema({
  tipo: String,
  url: String,
  observacion: String,
}, { _id: false });

const proyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  area: String,
  objetivos: String,
  cronograma: [actividadSchema],
  presupuesto: String,
  institucion: String,
  integrantes: [integranteSchema],
  historialestado: [historialEstadoSchema],
  archivos: [archivoSchema],
  estado: { type: String, enum: ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'], default: 'formulacion' },
  observacion: { type: String, default: '' },
  creadoPor: String,
}, { collection: 'proyectos' });

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;
