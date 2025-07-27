import { useState, useEffect, useCallback } from "react";
import { DELETE, GET, POST, PUT } from "../utils/methods/methods";
import { getSession, getDataFromSession } from "../utils/methods/session";


export function useGetLicenciasbyCurrentUser() {
    const [licencias, setLicencias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = getSession()?.token || "";
    
    const fetchLicencias = useCallback(async () => {
        setIsLoading(true);
        try {
            const { sub } = await getDataFromSession() || {};
            if (!sub) {
                console.error("No se pudo obtener el ID del usuario actual");
                setLicencias([]);
                return;
            }
            const response = await GET(`licencias/usuario/${sub}`, {}, token);
            console.log("Response from GET licencias:", response);
            if (response.code === 200) {
                setLicencias(response.licencias || []);
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
export function saveLicencia(data) {
    const token = getSession()?.token || "";
    return POST('licencias', data, token);
}

export function useGetLicenciasEmitidasbyCurrentUser(){
    const [licenciasEmitidas, setLicenciasEmitidas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = getSession()?.token || "";
    
    const fetchLicenciasEmitidas = useCallback(async () => {
        setIsLoading(true);
        try {
            const { sub } = await getDataFromSession() || {};
            if (!sub) {
                console.error("No se pudo obtener el ID del usuario actual");
                setLicenciasEmitidas([]);
                return;
            }
            ///usuario/{usuario_id}/emitidas
            const response = await GET(`licencias/usuario/${sub}/emitidas`, {}, token);
            console.log("Response from GET licencias emitidas:", response);
            if (response.code === 200) {
                setLicenciasEmitidas(response.licencias || []);
            } else {
                console.error("Error fetching licencias emitidas:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching licencias emitidas:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchLicenciasEmitidas();
    }, [fetchLicenciasEmitidas]);

    return { licenciasEmitidas, isLoading, refetch: fetchLicenciasEmitidas };
}

export function revocarLicencia(licenciaId) {
    const token = getSession()?.token || "";
    return PUT(`licencias/${licenciaId}/revocar`, {}, token);
}

export function ampliarDuracionLicencia(licenciaId, dias_extra) {
    const token = getSession()?.token || "";
    return PUT(`licencias/${licenciaId}/ampliar`, { dias_extra }, token);
}