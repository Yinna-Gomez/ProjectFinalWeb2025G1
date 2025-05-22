import React from 'react';

const AddMember = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* FORMULARIO */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-200 w-full max-w-md rounded-md p-8 border">
          <h2 className="text-center text-2xl font-semibold mb-6">Agregar integrante</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-2 rounded-md bg-white text-gray-600"
            />
            <input
              type="text"
              placeholder="Apellidos"
              className="w-full p-2 rounded-md bg-white text-gray-600"
            />
            <select
              className="w-full p-2 rounded-md bg-white text-gray-600"
              defaultValue=""
            >
              <option value="" disabled>Identificación</option>
              <option value="cc">Cédula de Ciudadanía</option>
              <option value="ti">Tarjeta de Identidad</option>
              <option value="ce">Cédula de Extranjería</option>
            </select>
            <input
              type="text"
              placeholder="Número Identificación"
              className="w-full p-2 rounded-md bg-white text-gray-600"
            />
            <select
              className="w-full p-2 rounded-md bg-white text-gray-600"
              defaultValue=""
            >
              <option value="" disabled>Grado escolar</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
              <option value="4">4°</option>
              <option value="5">5°</option>
              <option value="6">6°</option>
              <option value="7">7°</option>
              <option value="8">8°</option>
              <option value="9">9°</option>
              <option value="10">10°</option>
              <option value="11">11°</option>
            </select>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded border border-black hover:bg-yellow-500"
              >
                Volver
              </button>
              <button
                type="submit"
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded border border-black hover:bg-yellow-500"
              >
                Agregar integrante
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMember;