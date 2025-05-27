import axios from 'axios';

export const AuthService = {
  // Obtener token del localStorage
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Guardar token en localStorage y configurar axios
  setToken: (token) => {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Remover token y limpiar headers de axios
  removeToken: () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Verificar si el token existe
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Inicializar axios con el token existente
  initializeAxios: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Configurar interceptor de axios para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si recibimos un error 401 (No autorizado) o 403 (Prohibido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Limpiar token y redirigir al login
      AuthService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default AuthService;
