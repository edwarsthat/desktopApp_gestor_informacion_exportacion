/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { descarteType } from "../types/types"
import { validateReprocesarPredioRequest } from "../validations/validateRequest"

type outType = {
    reprocesarPredio: () => Promise<void>
    reprocesarCelifrut: () => Promise<void>
}

type propsType = {
    propsModal: { action: string, data: object }
    data: descarteType[]
}

export default function useSendRequest(props: propsType): outType {
    const { messageModal } = useAppContext();

    const reprocesarPredio = async (): Promise<void> => {
        try {
            const objRequest = {}
            const objRequestDescarte = {}
            let _id
            Object.keys(props.propsModal.data).forEach((item) => {
                const [id, tipoDescarte, descarte] = item.split('/')
                if (!Object.prototype.hasOwnProperty.call(objRequest, tipoDescarte)) {
                    objRequest[tipoDescarte] = {}
                    _id = id
                }
                if (descarte === 'frutaNacional') {
                    objRequest[tipoDescarte][descarte] = -props.propsModal.data[item]
                    objRequestDescarte[`${descarte}`] = 0
                } else {
                    objRequest[tipoDescarte][descarte] = -props.propsModal.data[item]
                    objRequestDescarte[`${tipoDescarte}.${descarte}`] = 0
                }
            })
            const request = {
                _id: _id,
                query: objRequestDescarte,
                inventario: objRequest,
                action: 'put_inventarios_frutaDescarte_reprocesarFruta'
            }
            validateReprocesarPredioRequest(request)
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(`Code ${response}: ${response.message}`)
            }
            messageModal('success', 'Fruta vaciada!')
        } catch (e) {
            if (e instanceof Error) {
                messageModal('error', `Error: ${e.message}`)
            }
        }
    }
    const reprocesarCelifrut = async (): Promise<void> => {
        try {
            const kilos = Object.keys(props.propsModal.data).reduce(
                (acu, item) => (acu += props.propsModal.data[item]),
                0
            )
            const objRequest = []
            const objectInventario = {
                descarteLavado: { descarteGeneral: 0, pareja: 0, balin: 0 },
                descarteEncerado: { descarteGeneral: 0, pareja: 0, balin: 0, extra: 0, suelo: 0 }
            }
            let _id
            Object.keys(props.propsModal.data).forEach((item) => {
                const [id, tipoDescarte, descarte] = item.split('/')
                if (!Object.prototype.hasOwnProperty.call(objRequest, id)) {
                    objRequest[id] = {}
                    _id = id
                }
                objRequest[id][`${tipoDescarte}.${descarte}`] = props.propsModal.data[item]
                objectInventario[tipoDescarte][descarte] += -props.propsModal.data[item]
            })
            const array = Object.keys(objRequest).map((key) => {
                return {
                    _id: key,
                    ...objRequest[key]
                }
            })
            const lote = props.data.find((lote) => lote._id === _id)

            const datos = {
                predio: '65c27f3870dd4b7f03ed9857',
                canastillas: '0',
                kilos: kilos,
                placa: 'AAA000',
                tipoFruta: lote?.tipoFruta,
                observaciones: 'Reproceso',
                promedio: Number(kilos) / (lote?.tipoFruta === 'Naranja' ? 19 : 20),
                descarteLavado: {
                    balin: 0,
                    pareja: 0,
                    descarteGeneral: 0,
                    descompuesta: 0,
                    piel: 0,
                    hojas: 0
                },
                descarteEncerado: {
                    balin: 0,
                    pareja: 0,
                    extra: 0,
                    descarteGeneral: 0,
                    descompuesta: 0,
                    suelo: 0
                }
            }

            const request = {
                lote: datos,
                lotes: array,
                inventario: objectInventario,
                action: 'put_inventarios_frutaDescarte_reprocesarCelifrut'
            }

            // console.log(request)


            const responseReprocesoCelifrut = await window.api.server2(request)
            if (responseReprocesoCelifrut.status !== 200)
                throw new Error(`Code ${responseReprocesoCelifrut}: ${responseReprocesoCelifrut.message}`)

            messageModal('success', 'Fruta reprocesada como Celifrut!')
        } catch (e) {
            if (e instanceof Error) {
                messageModal('error', `Error: ${e.message}`)
            }
        }
    }

    return {
        reprocesarPredio,
        reprocesarCelifrut
    }
}