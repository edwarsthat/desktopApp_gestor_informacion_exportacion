/* eslint-disable prettier/prettier */

import useAppContext from '@renderer/hooks/useAppContext'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'
import { itemInventarioType } from '../validations/types'
import { useConfirm } from '@renderer/hooks/useModalConfimartion'

type propsType = {
    select: itemInventarioType | undefined
    data: itemInventarioType[]
    setOpen: (open: boolean) => void
    setOpenMover: (open: boolean) => void
}

export default function BotonesDesverdizado(props: propsType): JSX.Element {
    const { loading, setLoading, messageModal } = useAppContext()
    //modal de confimacion
    const {
        setShowConfirmation, requestConfirm,
        showConfirmation, message, setConfirm
    } = useConfirm();

    const finalizar = async (): Promise<void> => {
        try {
            setLoading(true)
            if (!props.select) throw new Error("Seleccione un lote")
            const request = {
                _id: props.select.loteId,
                cuarto: props.select.cuartoId,
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

    return (
        <div className="inventario-desverdizado-botones-container ">
            <div >
                <button onClick={(): void => props.setOpen(true)} className="vaciar" disabled={loading}>
                    Parametros
                </button>
            </div>
            <div>
                <button
                    onClick={(): void => requestConfirm(
                        finalizar, "¿Seguro desea reprocesar la fruta"
                    )}
                    className="add-record" disabled={loading} >
                    Finalizar
                </button>
            </div>
            <div>
                <button onClick={(): void => props.setOpenMover(true)} 
                    className="add-record" disabled={loading} >
                    Mover
                </button>
            </div>
            <div></div>

            <div>
                <h3>{props.select ? props.select.enf : "|"}</h3>
            </div>

            <div>
                <h3>{props.select ? props.select.lote : '|'}</h3>
            </div>
            <div>
                <h3>Canastillas Total:
                    {
                        props.data.reduce((acu, item) => acu += Number(item.canastillas), 0).toFixed(2)
                    }
                </h3>
            </div>
            <div>
                <h3>Total:
                    {
                        props.data.reduce((acu, item) => acu += Number(item.canastillas) * item.promedio, 0).toFixed(2)
                    } Kg
                </h3>
            </div>
            {showConfirmation &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmation}
                />}

        </div>
    )
}
