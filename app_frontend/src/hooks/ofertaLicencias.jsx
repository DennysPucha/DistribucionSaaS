import { useState, useEffect, useCallback } from "react";
import { DELETE, GET, POST, PUT } from "../utils/methods/methods";
import { getSession } from "../utils/methods/session";

//Permite hacer el refetch de las licencias y devolver un boolean si isloading
export function useGetOfertaLicencias() {
  const [licencias, setLicencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getSession()?.token || "";

  const fetchLicencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await GET('ofertas-licencia', {}, token);
      
      if (response.code === 200) {
        // Verificamos si la respuesta tiene datos, incluso si es un array vacío
        const data = response.ofertas_licencia || [];
        console.log("Licencias obtenidas:", data);
        setLicencias(data);
      } else {
        const errorMsg = response.message || "Error al obtener las licencias";
        console.error("Error fetching licencias:", errorMsg);
        setError(errorMsg);
        setLicencias([]); // Aseguramos que el estado sea un array vacío
      }
    } catch (error) {
      console.error("Error fetching licencias:", error);
      setError(error.message || "Error de conexión");
      setLicencias([]); // Aseguramos que el estado sea un array vacío
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLicencias();
  }, [fetchLicencias]);

  return { licencias, isLoading, error, refetch: fetchLicencias };
}


export function useGetOfertaLicenciasByUser(id_usuario) {
  const [licencias, setLicencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = getSession()?.token || "";

  const fetchLicencias = useCallback(async () => {
    if (!id_usuario) {
      setLicencias([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await GET(`ofertas-licencia/usuario/${id_usuario}`, {}, token);
      if (response.code === 200) {
        setLicencias(response.ofertas_licencia || []);
      } else {
        console.error("Error fetching licencias:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching licencias:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, id_usuario]);

  useEffect(() => {
    fetchLicencias();
  }, [fetchLicencias]);

  return { licencias, isLoading, refetch: fetchLicencias };
}

export function saveOfertaLicencia(data) {
  const token = getSession()?.token || "";
  return POST('ofertas-licencia', data, token);
}


export function updateOfertaLicencia(id, data) {
  const token = getSession()?.token || "";
  return PUT(`ofertas-licencia/${id}`, data, token);
}

export function deleteOfertaLicencia(id) {
  const token = getSession()?.token || "";
  return DELETE(`ofertas-licencia/${id}`, {}, token);
}

export function useGetOfertaLicenciasById(id) {
  const [licencia, setLicencia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = getSession()?.token || "";

  const fetchLicencia = useCallback(async () => {
    if (!id) {
      setLicencia(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await GET(`ofertas-licencia/${id}`, {}, token);
      if (response.code === 200) {
        setLicencia(response.oferta_licencia || null);
      } else {
        console.error("Error fetching licencia:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching licencia:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchLicencia();
  }, [fetchLicencia]);

  return { licencia, isLoading, refetch: fetchLicencia };
}