import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  contrasenia: { type: String, required: true }, 
  nombre: String,
  apellido: String,
  correo: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['coordinador', 'docente', 'integrante'], required: true },
  tipoIdentificacion: String,
  identificacion: String,
  gradoEscolar: String,
}, { collection: 'usuarios' }); // <-- fuerza el nombre de la colección

const User = mongoose.model('User', userSchema);
export default User;