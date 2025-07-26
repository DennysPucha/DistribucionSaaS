import { useState, useEffect, useCallback } from "react";
import { GET } from "../utils/methods/methods";
import { getSession } from "../utils/methods/session";

//Permite hacer el refetch de las licencias y devolver un boolean si isloading
export function useGetOfertaLicencias() {
    const [licencias, setLicencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = getSession()?.token || "";
  
    const fetchLicencias = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await GET('ofertas-licencia', {}, token);
        if (response.code === 200) {
          // console.log("Licencias obtenidas:", response);
          setLicencias(response.ofertas_licencia || []);
        } else {
          console.error("Error fetching licencias:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching licencias:", error);
      } finally {
        setIsLoading(false);
      }
    }, [token]);
  
    useEffect(() => {
      fetchLicencias();
    }, [fetchLicencias]);
  
    return { licencias, isLoading, refetch: fetchLicencias };
}
