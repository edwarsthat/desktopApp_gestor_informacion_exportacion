/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"

type propsType = {
    select?: lotesType | undefined
    temperatura?: string
    etileno?:string
    dioxido?:string
    humedad?:string
}

type outType = {
    finalizar: () => Promise<void>
    guardar: () => Promise<void>
}

export default function useInventarioDesverdizado(props: propsType): outType {
    const { messageModal, setLoading } = useAppContext();
    const finalizar = async (): Promise<void> => {
        try {
            setLoading(true)
            if (!props.select) throw new Error("Seleccione un lote")
            const request = {
                _id: props.select._id,
                __v: props.select.__v,
                action: "put_inventarios_frutaDesverdizado_finalizar"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Finzalizado con exito")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const guardar = async (): Promise<void> => {
        try {
            setLoading(true)
            if (props.select === undefined) throw new Error("No se ha seleccionado lote")

            const parametros = {
                temperatura: props.temperatura,
                etileno: props.etileno,
                carbono: props.dioxido,
                humedad: props.humedad,
                fecha: new Date().toUTCString()

            }
            const request = {
                __v: props.select.__v,
                _id: props.select._id,
                data: parametros,
                action: 'put_inventarios_frutaDesverdizando_parametros',

            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Guardado con exito!")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return {
        finalizar,
        guardar
    }
}
