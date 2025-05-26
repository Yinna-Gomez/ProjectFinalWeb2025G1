import mongoose from 'mongoose';

const integranteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  tipoIdentificacion: { type: String, required: true },
  identificacion: { type: String, required: true },
  gradoEscolar: { type: String, required: true },
  correo: { type: String, required: true, lowercase: true },
  observaciones: { type: String, default: '' },
  estado: { type: String, default: 'activo' }
}, { _id: false });

const actividadSchema = new mongoose.Schema({
  actividad: { type: String, required: true },
  fechainicio: { type: String, required: true },
  fechafin: { type: String, required: true },
}, { _id: false });

const historialEstadoSchema = new mongoose.Schema({
  estado: { type: String, required: true },
  fecha: { type: String, required: true },
  observacion: { type: String, required: true },
}, { _id: false });

const archivoSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  url: { type: String, required: true },
  nombre: { type: String, required: true },
  observacion: { type: String, default: '' },
  fechaSubida: { type: Date, default: Date.now }
}, { _id: false });

const avanceSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  descripcion: { type: String, required: true },
  archivos: [archivoSchema],
  creadoPor: { type: String, required: true }
}, { _id: false });

const proyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  area: { type: String, default: '' },
  objetivos: { type: String, default: '' },
  cronograma: [actividadSchema],
  presupuesto: { type: String, default: '' },
  institucion: { type: String, default: '' },
  integrantes: [integranteSchema],
  historialestado: [historialEstadoSchema],
  avances: [avanceSchema],
  estado: { 
    type: String, 
    enum: ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'], 
    default: 'formulacion' 
  },
  observacion: { type: String, default: '' },
  creadoPor: { type: String, required: true },
}, { 
  collection: 'proyectos',
  timestamps: true 
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;
