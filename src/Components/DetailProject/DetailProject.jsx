import React from 'react';

const DetailProject = () => {
  const projectDetails = {
    title: "Título del proyecto 1",
    status: "Formulación",
    area: "Área del proyecto",
    objectives: "Objetivos del proyecto",
    cronogram: "Cronograma del proyecto",
    budget: "Presupuesto del proyecto",
    educationalInstitution: "Institución Educativa del proyecto",
    members: "Integrantes del proyecto"
  };

  const files = [
    { name: "128-ABC-00-DR-A-103-GA PLAN LEVEL 00", size: "1:100" },
    { name: "128-ABC-01-DR-A-104-GA PLAN LEVEL 01", size: "1:100" },
    { name: "128-ABC-B1-DR-A-102-GA PLAN LEVEL -0'", size: "1:100" },
    { name: "128-DEF-00-DR-S-111-LEVEL 00 DECK REF", size: "1:100" },
    { name: "128-DEF-01-DR-S-201-LEVEL 01 DECK REF", size: "1:100" },
    { name: "128-DEF-B1-DR-S-101-LEVEL B1 - PILES &", size: "1:100" },
  ];

  const images = [
    "20180329_081951.jpg",
    "20180329_121206.jpg",
    "25254688767_590039f06c_o.jpg",
    "3805645431_a3f409f4d7_o.jpg",
    "38503831555_9ae89f5c10_o.jpg",
    "DSC08899.JPG",
    "DSC08900.JPG",
    "DSC08901.JPG",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* PROJECT DETAIL CONTENT */}
      <main className="flex-grow flex justify-center p-6 bg-gray-100">
        <div className="bg-white w-full max-w-4xl rounded-md shadow-md p-8 border border-gray-300">
          <h2 className="text-center text-3xl font-semibold mb-8 text-gray-800">Detalle del proyecto</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="md:col-span-1 border-r border-gray-200 pr-4">
              <div className="space-y-4">
                {Object.entries(projectDetails).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-lg font-medium text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Files Section */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Archivos</h3>
              <div className="bg-white border border-gray-300 p-4 rounded-md h-60 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-1 rounded cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113.414 2L16 4.586A2 2 0 0118 6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">PDF, Scale {file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Imágenes</h3>
              <div className="bg-white border border-gray-300 p-4 rounded-md h-60 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-1 rounded cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4v4zM8 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">{image}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              type="button"
              className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded border border-black hover:bg-yellow-500 transition duration-200"
            >
              Volver
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailProject;