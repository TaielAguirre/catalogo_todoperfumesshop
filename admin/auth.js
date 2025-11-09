// Sistema de Autenticación
// Usuario: admin
// Contraseña: Todoperfumes123

const AUTH_STORAGE_KEY = 'tps_admin_auth';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas

// Verificar si el usuario está autenticado
function isAuthenticated() {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;
    
    try {
        const auth = JSON.parse(authData);
        const now = Date.now();
        
        // Verificar si la sesión expiró
        if (now - auth.timestamp > SESSION_TIMEOUT) {
            logout();
            return false;
        }
        
        return auth.authenticated === true && auth.username === 'admin';
    } catch (e) {
        return false;
    }
}

// Iniciar sesión
function login(username, password) {
    // Credenciales válidas
    const validUsername = 'admin';
    const validPassword = 'Todoperfumes123';
    
    if (username === validUsername && password === validPassword) {
        const authData = {
            authenticated: true,
            username: username,
            timestamp: Date.now()
        };
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        return { success: true, message: 'Login exitoso' };
    } else {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.location.href = 'admin.html';
}

// Proteger ruta admin
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'admin.html';
        return false;
    }
    return true;
}

// Obtener información del usuario autenticado
function getAuthUser() {
    if (!isAuthenticated()) return null;
    
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
        return JSON.parse(authData);
    }
    return null;
}

// Verificar y renovar sesión si es necesario
function checkSession() {
    if (isAuthenticated()) {
        const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
        const now = Date.now();
        
        // Renovar sesión si aún es válida
        if (now - authData.timestamp < SESSION_TIMEOUT) {
            authData.timestamp = now;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        }
    }
}

// Verificar sesión periódicamente
setInterval(checkSession, 60 * 60 * 1000); // Cada hora


