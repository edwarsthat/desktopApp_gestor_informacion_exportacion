/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import { reoreder } from "../functions/functions"

type typeOut = {
    obtenerData: () => Promise<void>
    handleAddOrdenVaceo: (_id: string) => Promise<void>
    handleRemoveOrdenVaceo: (_id: string) => Promise<void>
    handleMoveOrdenVaceo: (source, destination) => Promise<void>
    lotes: lotesType[]
    lotesOrdenVaceo: lotesType[]
}

type propsType = {
    filtroPrediosInventario: filtroPrediosInventarioType
}

export type filtroPrediosInventarioType = {
    filtro: string,
    select: string
}

export default function useDataOrdenVaceo({ filtroPrediosInventario }: propsType): typeOut {
    const { messageModal } = useAppContext();
    const [lotes, setLotes] = useState<lotesType[]>([])
    const [lotesOriginal, setLotesOriginal] = useState<lotesType[]>([])
    const [ordenVaceo, setOrdenVaceo] = useState<string[]>([])
    const [lotesOrdenVaceo, setLotesOrdenVaceo] = useState<lotesType[]>([])

    const obtenerData = async (): Promise<void> => {
        try {
            const requestLotes = {
                action: 'get_inventarios_ordenVaceo_inventario'
            }
            const responseLotes = await window.api.server2(requestLotes)

            if (responseLotes.status !== 200) {
                throw new Error(responseLotes.message);
            }
            const requestOrdenVaceo = {
                action: 'get_inventarios_ordenVaceo_ordenVaceo'
            }
            const responseOrden = await window.api.server2(requestOrdenVaceo)
            if (responseOrden.status !== 200) {
                throw new Error(responseOrden.message)
            }
            setOrdenVaceo(responseOrden.data)

            const nuevosLotes = responseLotes.data.filter((lote) => !responseOrden.data.includes(lote._id))
            setLotes(nuevosLotes)
            setLotesOriginal(nuevosLotes)
            const nuevosLotesOrdenVaceo = responseOrden.data.map((_id) => responseLotes.data.find(lote => lote._id === _id))
            setLotesOrdenVaceo(nuevosLotesOrdenVaceo)

        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    }

    const handleAddOrdenVaceo = async (_id): Promise<void> => {
        try {
            setOrdenVaceo(item => [...item, String(_id)]);
            const request = {
                data: [...ordenVaceo, String(_id)],
                action: 'put_inventarios_ordenVaceo_modificar'
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(response.message);
            }
            messageModal("success", "Guardado con exito");
            await obtenerData()
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message);
            }
        }
    }

    const handleRemoveOrdenVaceo = async (_id): Promise<void> => {
        try {
            const nuevaOrdenVaceo = ordenVaceo.filter(item => item !== String(_id));
            setOrdenVaceo(nuevaOrdenVaceo);
            const request = {
                data: [...nuevaOrdenVaceo],
                action: 'put_inventarios_ordenVaceo_modificar'
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(response.message);
            }
            messageModal("success", "Guardado con exito");
            await obtenerData()
        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message);
            }
        }
    }

    const handleMoveOrdenVaceo = async (source, destination): Promise<void> => {
        try {
            const newOrdenVaceo = reoreder(ordenVaceo, source, destination);
            const request = {
                data: newOrdenVaceo,
                action: 'put_inventarios_ordenVaceo_modificar'
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(response.message);
            }
            messageModal("success", "Guardado con exito");
            await obtenerData()

        } catch (e) {
            if (e instanceof Error) {
                messageModal("error", e.message);
            }
        }
    }

    useEffect(() => {
        let data = lotesOriginal.filter(item => item.predio?.PREDIO?.toLocaleLowerCase().startsWith(filtroPrediosInventario.filtro));
        if (filtroPrediosInventario.select !== "")
            data = data.filter(item => item.tipoFruta.tipoFruta === filtroPrediosInventario.select);
        setLotes(data);
    }, [filtroPrediosInventario.filtro, filtroPrediosInventario.select, lotesOriginal])
    return {
        obtenerData,
        handleAddOrdenVaceo,
        handleRemoveOrdenVaceo,
        handleMoveOrdenVaceo,
        lotes,
        lotesOrdenVaceo
    }
}
