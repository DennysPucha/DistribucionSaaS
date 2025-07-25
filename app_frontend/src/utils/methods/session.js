export async function setSession(token) {
    try {
        // Guardar el token en localStorage
        localStorage.setItem('access_token', token);
        console.log("Sesión iniciada correctamente");
    } catch (error) {
        console.error("Error al establecer la sesión:", error);
    }
}
export async function getSession() {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error("No hay sesión activa");
        }
        return token;
    } catch (error) {
        console.error("Error al obtener la sesión:", error);
        return null;
    }
}

export async function clearSession() {
    try {
        // Eliminar el token del localStorage
        localStorage.removeItem('access_token');
        console.log("Sesión cerrada correctamente");
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
}
export async function isAuthenticated() {
    try {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('access_token');
        return !!token; // Devuelve true si hay un token, false si no
    } catch (error) {
        console.error("Error al verificar la autenticación:", error);
        return false;
    }
}

export async function getDataFromSession() {
    try {
      const token = await getSession();
      if (!token) {
        throw new Error("No hay sesión activa");
      }
  
      const payload = JSON.parse(atob(token.split('.')[1]));
  
      if (!payload || !payload.rol_id) {
        await clearSession();
        throw new Error("Token inválido");
      }
  
      return payload;
    } catch (error) {
      console.error("Error al obtener los datos de la sesión:", error);
      return null;
    }
}

export async function logout() {
    try {
        // Limpiar la sesión
        await clearSession();
        console.log("Sesión cerrada correctamente");
    } catch (error) {
        console.error("Error al cerrar la sesión:", error);
    }
}