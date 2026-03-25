import { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const API = import.meta.env.VITE_API_URL;
  
  // 1. Extraemos el token directamente de la ruta (/reset-password/:token)
  const { token } = useParams();
  
  // 2. Extraemos el email de los parámetros de búsqueda (?email=...)
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 3. Ya enviamos correctamente el token y el email en la petición
      const response = await axios.post(`${API}/reset-password`, {
        token: token,
        email: email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      setSuccess(response.data.message);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else {
        setError('Error al restablecer la contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-5">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Restablecer contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form className="mt-8 space-y-6 w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px w-full flex flex-col  gap-5 p-10">
            <div>
              <label htmlFor="password" className="sr-only">
                Nueva contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nueva contraseña"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
              />
            </div>
            <div>
              <label htmlFor="password_confirmation" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                value={formData.password_confirmation}
                onChange={handleChange}
                minLength={8}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-800">{success}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
