// config.js
import axios from 'axios';
import AuthService from './services/authService';

axios.defaults.baseURL = 'http://localhost:3000/api/';

// Inicializar axios con el token existente al cargar la aplicación
AuthService.initializeAxios();
