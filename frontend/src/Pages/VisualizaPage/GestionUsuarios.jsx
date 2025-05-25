import React, { useState, useRef } from 'react';
import './GestionUsuarios.css';

const roles = [
  { value: 'coordinador', label: 'Coordinador' },
  { value: 'docente', label: 'Docente' },
  { value: 'integrante', label: 'Integrante (Estudiante)' },
];

const tiposIdentificacion = [
  { value: 'cc', label: 'Cédula de Ciudadanía' },
  { value: 'ti', label: 'Tarjeta de Identidad' },
  { value: 'ce', label: 'Cédula de Extranjería' },
];

const initialForm = {
  usuario: '',
  contrasenia: '',
  nombre: '',
  apellido: '',
  correo: '',
  rol: '',
  tipoIdentificacion: '',
  identificacion: '',
  gradoEscolar: '',
};

function randomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GestionUsuarios = () => {
  const [modo, setModo] = useState(''); // '', 'crear', 'editar', 'eliminar'
  const [form, setForm] = useState(initialForm);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef();

  // Autollenar usuario y contraseña únicos
  const autollenarUsuario = async () => {
    let nuevoUsuario, existe;
    do {
      nuevoUsuario = 'user' + randomString(4);
      existe = await fetch(`http://localhost:3001/api/usuarios/${nuevoUsuario}`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);
    } while (existe);
    setForm(f => ({ ...f, usuario: nuevoUsuario, contrasenia: randomString(8) }));
  };

  // Manejar cambios en el formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'rol' && value !== 'integrante') {
      setForm(f => ({ ...f, gradoEscolar: '' }));
    }
  };

  // Validaciones de formulario
  const validarForm = (datos, esEdicion = false) => {
    if (!datos.usuario || !datos.contrasenia || !datos.nombre || !datos.apellido || !datos.correo || !datos.rol || !datos.tipoIdentificacion || !datos.identificacion) {
      return 'Todos los campos son obligatorios';
    }
    if (!emailRegex.test(datos.correo)) {
      return 'Correo electrónico inválido';
    }
    if (datos.contrasenia.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (datos.rol === 'integrante' && !datos.gradoEscolar) {
      return 'El grado escolar es obligatorio para integrantes';
    }
    return '';
  };

  // Crear usuario
  const handleCrear = async e => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    setError('');
    // Normaliza mayus/minus
    const datos = { ...form };
    datos.usuario = datos.usuario.trim().toLowerCase();
    datos.correo = datos.correo.trim().toLowerCase();
    datos.rol = datos.rol.trim().toLowerCase();
    const errorMsg = validarForm(datos);
    if (errorMsg) {
      setError(errorMsg);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const data = await res.json();
      if (res.ok && data.usuario && data.usuario._id) {
        setMensaje('Usuario creado exitosamente');
        setForm(initialForm);
      } else {
        setError(data.message || 'Error al crear usuario');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  // Búsqueda en tiempo real (debounce)
  const handleBusqueda = e => {
    setBusqueda(e.target.value);
    setMensaje('');
    setError('');
    setForm(initialForm);
    setUsuarioId('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const valor = e.target.value.trim().toLowerCase();
    if (!valor) return;
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/usuarios/${valor}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data);
          setUsuarioId(data._id);
          setMensaje('Usuario encontrado');
        } else {
          setError('Usuario no encontrado');
          setForm(initialForm);
          setUsuarioId('');
        }
      } catch {
        setError('Error de conexión');
      }
      setLoading(false);
    }, 600);
  };

  // Actualizar usuario
  const handleActualizar = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setLoading(true);
    const datos = { ...form };
    datos.usuario = datos.usuario.trim().toLowerCase();
    datos.correo = datos.correo.trim().toLowerCase();
    datos.rol = datos.rol.trim().toLowerCase();
    const errorMsg = validarForm(datos, true);
    if (errorMsg) {
      setError(errorMsg);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('Usuario actualizado exitosamente');
        setForm(initialForm);
        setUsuarioId('');
        setBusqueda('');
      } else {
        setError(data.message || 'Error al actualizar usuario');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  // Eliminar usuario
  const handleEliminar = async () => {
    setMensaje('');
    setError('');
    setLoading(true);
    if (!usuarioId) {
      setError('Debes buscar y seleccionar un usuario válido');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/usuarios/${usuarioId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMensaje('Usuario eliminado exitosamente');
        setForm(initialForm);
        setUsuarioId('');
        setBusqueda('');
      } else {
        setError('No se pudo eliminar el usuario');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  return (
    <div className="gestion-usuarios-panel">
      <h3 className="gestion-usuarios-title">Gestión de usuarios</h3>
      <div className="gestion-usuarios-acciones">
        <button className="gestion-btn" onClick={() => { setModo('crear'); setForm(initialForm); setMensaje(''); setError(''); }}>Crear usuario</button>
        <button className="gestion-btn" onClick={() => { setModo('editar'); setForm(initialForm); setMensaje(''); setError(''); }}>Editar usuario</button>
        <button className="gestion-btn" onClick={() => { setModo('eliminar'); setForm(initialForm); setMensaje(''); setError(''); }}>Eliminar usuario</button>
      </div>
      <div className="gestion-usuarios-form-contenedor">
        {error && <div className="gestion-usuarios-error">{error}</div>}
        {mensaje && <div className="gestion-usuarios-mensaje">{mensaje}</div>}
        {modo === 'crear' && (
          <form className="gestion-usuarios-form" onSubmit={handleCrear} autoComplete="off">
            <div className="gestion-form-row">
              <button type="button" className="gestion-btn gestion-btn-auto" onClick={autollenarUsuario}>Autollenar usuario/contraseña</button>
            </div>
            <div className="gestion-form-row">
              <input name="usuario" value={form.usuario} onChange={handleChange} placeholder="Usuario" required />
              <input name="contrasenia" value={form.contrasenia} onChange={handleChange} placeholder="Contraseña" required />
            </div>
            <div className="gestion-form-row">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
            </div>
            <div className="gestion-form-row">
              <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" required type="email" />
            </div>
            <div className="gestion-form-row">
              <select name="rol" value={form.rol} onChange={handleChange} required>
                <option value="">Selecciona rol</option>
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="gestion-form-row">
              <select name="tipoIdentificacion" value={form.tipoIdentificacion} onChange={handleChange} required>
                <option value="">Selecciona tipo de identificación</option>
                {tiposIdentificacion.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input name="identificacion" value={form.identificacion} onChange={handleChange} placeholder="Identificación" required />
            </div>
            {form.rol === 'integrante' && (
              <div className="gestion-form-row">
                <input name="gradoEscolar" value={form.gradoEscolar} onChange={handleChange} placeholder="Grado escolar" required />
              </div>
            )}
            <div className="gestion-form-row">
              <button className="gestion-btn" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear usuario'}</button>
            </div>
          </form>
        )}
        {modo === 'editar' && (
          <div className="gestion-usuarios-form">
            <div className="gestion-form-row">
              <input placeholder="Buscar usuario" value={busqueda} onChange={handleBusqueda} />
            </div>
            {usuarioId && (
              <form onSubmit={handleActualizar} autoComplete="off">
                <div className="gestion-form-row">
                  <input name="usuario" value={form.usuario} onChange={handleChange} placeholder="Usuario" required />
                  <input name="contrasenia" value={form.contrasenia} onChange={handleChange} placeholder="Contraseña" required />
                </div>
                <div className="gestion-form-row">
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
                  <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
                </div>
                <div className="gestion-form-row">
                  <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" required type="email" />
                </div>
                <div className="gestion-form-row">
                  <select name="rol" value={form.rol} onChange={handleChange} required>
                    <option value="">Selecciona rol</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="gestion-form-row">
                  <select name="tipoIdentificacion" value={form.tipoIdentificacion} onChange={handleChange} required>
                    <option value="">Selecciona tipo de identificación</option>
                    {tiposIdentificacion.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input name="identificacion" value={form.identificacion} onChange={handleChange} placeholder="Identificación" required />
                </div>
                {form.rol === 'integrante' && (
                  <div className="gestion-form-row">
                    <input name="gradoEscolar" value={form.gradoEscolar} onChange={handleChange} placeholder="Grado escolar" required />
                  </div>
                )}
                <div className="gestion-form-row">
                  <button className="gestion-btn" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Actualizar usuario'}</button>
                </div>
              </form>
            )}
          </div>
        )}
        {modo === 'eliminar' && (
          <div className="gestion-usuarios-form">
            <div className="gestion-form-row">
              <input placeholder="Buscar usuario" value={busqueda} onChange={handleBusqueda} />
            </div>
            {usuarioId && (
              <div className="gestion-form-row">
                <button className="gestion-btn gestion-btn-eliminar" onClick={handleEliminar} disabled={loading}>{loading ? 'Eliminando...' : 'Eliminar usuario'}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionUsuarios;
