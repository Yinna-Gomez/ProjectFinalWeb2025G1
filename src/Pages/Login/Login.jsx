import React from 'react';

const Login = () => {
    return (
        <div className="flex flex-col min-h-screen">

            {/* LOGIN BOX */}
            <div className="flex justify-center items-center flex-grow bg-white">
                <div className="bg-gray-200 p-10 rounded shadow-md w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
                    <p className="text-sm mb-4">
                        ¿No tienes una cuenta? <a href="#" className="text-blue-600 hover:underline">Regístrate</a>
                    </p>

                    <input
                        type="email"
                        placeholder="Correo"
                        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-4 py-2 mb-2 rounded border border-gray-300 focus:outline-none"
                    />
                    <div className="text-sm mb-4 text-blue-600 hover:underline">
                        <a href="#">¿Has olvidado la contraseña?</a>
                    </div>

                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded w-full border border-gray-500">
                        Iniciar Sesión
                    </button>

                    <p className="mt-6 mb-4 text-sm">O conéctate con</p>

                    <div className="space-y-2">
                        <button className="flex items-center justify-center bg-[#126083] text-white py-2 px-4 rounded w-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-5 h-5 mr-2" />
                            Facebook
                        </button>
                        <button className="flex items-center justify-center bg-white text-black py-2 px-4 border rounded w-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 h-5 mr-2" />
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;