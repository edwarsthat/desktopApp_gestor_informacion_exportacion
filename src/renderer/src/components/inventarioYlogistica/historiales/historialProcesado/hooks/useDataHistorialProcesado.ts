/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { historialLotesType } from "@renderer/types/lotesType";
import { useEffect, useState } from "react";
import { validateRequestGetData } from "../validation/requestValidation";

type propsType = {
    fechaInicio: string
    fechaFin: string
    tipoFruta: string
    GGN: boolean
}

type outType = {
    obtenerHistorialProceso: () => Promise<void>
    data: historialLotesType[]
}

export default function useDataHistorialProcesado({ fechaInicio, fechaFin, tipoFruta, GGN }:propsType): outType {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<historialLotesType[]>([])
    const [dataOriginal, setDataOriginal] = useState<historialLotesType[]>([])

    const obtenerHistorialProceso = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                action: 'get_inventarios_historialProcesado_frutaProcesada',
            }
            validateRequestGetData(request)
            const frutaActual = await window.api.server2(request)
            console.log(frutaActual)

            if (frutaActual.status !== 200) {
                messageModal("error", `Error ${frutaActual.status}: ${frutaActual.message}`)
            }
            setData(frutaActual.data)
            setDataOriginal(frutaActual.data)
        } catch (e: unknown) {
            if (e instanceof Error) {
                messageModal("error", `Error: ${e.message}`);
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        let filterData = dataOriginal
        console.log("tipoFruta", tipoFruta)
        console.log("filterData", filterData)
        if(tipoFruta){
            filterData = filterData.filter(item => item.documento.tipoFruta._id === tipoFruta)
        }
        if(GGN){
            filterData = filterData.filter(item => item.documento.GGN)
        }
        setData(filterData)
    },[tipoFruta, GGN])
    return {
        obtenerHistorialProceso,
        data
    }
}
