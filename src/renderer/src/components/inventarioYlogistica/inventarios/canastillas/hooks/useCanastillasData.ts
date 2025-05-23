/* eslint-disable prettier/prettier */

import { useState, useCallback, useEffect } from "react";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { inventarioCanastillasType } from "@renderer/types/inventarioCanastillas";
import { obtener_proveedores, obtener_clientes_nacionales } from "@renderer/functions/SystemRequest";
import useAppContext from "@renderer/hooks/useAppContext";
import { clientesNacionalesType } from "@renderer/types/clientesType";

type CanastillasData = {
    proveedores: proveedoresType[];
    clientesNacionales: clientesNacionalesType[];
    inventario: inventarioCanastillasType;
    fetchData: () => Promise<void>;

};

export function useCanastillasData(): CanastillasData {
    const { setLoading, messageModal } = useAppContext();
    const [proveedores, setProveedores] = useState<proveedoresType[]>([]);
    const [inventario, setInventario] = useState<inventarioCanastillasType>({
         canastillasPrestadas: 0
    });
    const [clientesNacionales, setClientesNacionales] = useState<clientesNacionalesType[]>([])

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            await obtenerProveedores();
            await obtenerClientesNacionales();
            await obtenerInventarioCanastillas()

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerProveedores = async (): Promise<void> => {
        const proveedoresResponse = await obtener_proveedores("activos");
        if (proveedoresResponse instanceof Error) {
            throw proveedoresResponse;
        }
        setProveedores(proveedoresResponse);
    }
    const obtenerClientesNacionales = async (): Promise<void> => {
        const clinetesNacionalesresponse = await obtener_clientes_nacionales()
        if (clinetesNacionalesresponse instanceof Error) {
            throw clinetesNacionalesresponse;
        }
        console.log(clientesNacionales)
        setClientesNacionales(clinetesNacionalesresponse)
    }

    const obtenerInventarioCanastillas = async (): Promise<void> => {
        const inventarioResponse = await window.api.server2({
            action: "get_inventarios_canastillas_canastillasCelifrut",
        });
        if (inventarioResponse.status !== 200) {
            throw new Error(`Code ${inventarioResponse.status}: ${inventarioResponse.message}`);
        }
        setInventario(inventarioResponse.data);
    }

    useEffect(()=>{
        fetchData()
    },[])

    return {
        proveedores,
        clientesNacionales,
        inventario,
        fetchData,
    };
}
