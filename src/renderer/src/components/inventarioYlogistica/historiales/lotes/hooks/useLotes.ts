/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useState } from "react";
import { numeroContenedorType } from "../functions/request";
import { lotesType } from "@renderer/types/lotesType";
import { FilterValues } from "@renderer/hooks/useFiltro";
import { validateRequestLotes } from "../validations/requestValidations";
import { proveedoresType } from "@renderer/types/proveedoresType";

type typeOut = {
    obtenerProveedores: () => Promise<void>
    prediosData: proveedoresType[]
    obtenerData: () => Promise<void>
    data: lotesType[]
    numeroContenedor: numeroContenedorType | undefined
}

type propsType = {
    currentFilters: FilterValues
}

export default function useLotes({ currentFilters }: propsType): typeOut {
    const { messageModal } = useAppContext();
    const [prediosData, setPrediosData] = useState<proveedoresType[]>([])
    const [numeroContenedor, setNumeroContenedor] = useState<numeroContenedorType>()
    const [data, setData] = useState<lotesType[]>([])

    const obtenerProveedores = async (): Promise<void> => {
        try {
            const requestProveedor = {
                action: 'get_sys_proveedores',
                data: "all"
            };
            const response = await window.api.server2(requestProveedor);
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`)
            setPrediosData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`);
            }
        }
    }

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                ...currentFilters,
                action: 'get_inventarios_lotes_infoLotes',
            };
            validateRequestLotes(request)
            const datosLotes = await window.api.server2(request);
            console.log(datosLotes)
            if (datosLotes.status !== 200)
                throw new Error(datosLotes.message)
            //se vana obtener los datos para traer los contenedores
            const contenedores: string[] = []
            datosLotes.data.lotes.forEach(element => {
                element.contenedores.forEach(contenedor => contenedores.push(contenedor))
            })

            const objCont = {}
            datosLotes.data.contenedores.map(element => {
                objCont[element._id] = element.numeroContenedor
            });
            setNumeroContenedor(objCont)
            setData(datosLotes.data.lotes)
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`);
            }
        }
    }
    return {
        obtenerProveedores,
        prediosData,
        obtenerData,
        data,
        numeroContenedor
    }
}