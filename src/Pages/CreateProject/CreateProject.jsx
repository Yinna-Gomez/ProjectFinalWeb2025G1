import React from 'react';

const CreateProject = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* FORMULARIO */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-200 w-full max-w-4xl rounded-md p-8">
          <h2 className="text-center text-2xl font-semibold mb-6">Crear Proyecto</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Titulo" className="p-2 rounded-md bg-white text-gray-500" />
            <input type="text" placeholder="Presupuesto" className="p-2 rounded-md bg-white text-gray-500" />

            <input type="text" placeholder="Área" className="p-2 rounded-md bg-white text-gray-500" />
            <input type="text" placeholder="Institución Educativa" className="p-2 rounded-md bg-white text-gray-500" />

            <input type="text" placeholder="Objetivos" className="p-2 rounded-md bg-white text-gray-500" />
            <button className="p-2 rounded-md bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition">
              Agregar Integrantes
            </button>

            <input type="text" placeholder="Cronograma" className="p-2 rounded-md bg-white text-gray-500" />
            <input type="text" placeholder="Observaciones" className="p-2 rounded-md bg-white text-gray-500" />
          </div>

          <div className="mt-6 text-right">
            <button className="bg-yellow-400 hover:bg-yellow-500 transition text-black font-semibold px-4 py-2 rounded border border-black">
              Crear Proyecto
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProject;
