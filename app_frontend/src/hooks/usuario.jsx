import { useState, useEffect, useCallback } from "react";
import { DELETE, GET, POST, PUT } from "../utils/methods/methods";
import { getSession, getDataFromSession } from "../utils/methods/session";

export async function completarPerfilUsuario(data){
    const token = getSession()?.token || "";
    const {sub} = await getDataFromSession() || "";
    const response = POST(`usuarios/completar-perfil/${sub}`, data, token);
    return response;
}

export function useGetCurrentUser(){
    const [dataSession, setDataSession] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const token = getSession()?.token || "";
    

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { sub } = await getDataFromSession() || {};
            const response = await GET(`usuarios/${sub}`, {}, token);
            if (response.code === 200) {
                console.log("User data fetched successfully:", response.usuario);
                setDataSession(response.usuario || {});
            } else {
                console.error("Error fetching user data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { dataSession, isLoading, refetch: fetchData };
}