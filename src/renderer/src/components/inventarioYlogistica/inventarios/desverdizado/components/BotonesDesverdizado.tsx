/* eslint-disable prettier/prettier */

import useAppContext from '@renderer/hooks/useAppContext'
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal'
import { lotesType } from '@renderer/types/lotesType'
import { useEffect, useState } from 'react'
import useInventarioDesverdizado from '../hooks/useInventarioDesverdizado'

type propsType = {
    select: lotesType | undefined
    data: lotesType[]
}

export default function BotonesDesverdizado(props: propsType): JSX.Element {
    const { messageModal, loading } = useAppContext()
    const { finalizar } = useInventarioDesverdizado({ select: props.select })
    //modal de confimacion
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message] = useState<string>('¿Desea finalizar el desverdizado?')
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

    useEffect(() => {
        if (confirm) {
            finalizar()
            setConfirm(false)
        }
    }, [confirm])
    const handleClickParametros = (): void => {
        if (!props.select) return
        const dialogSetting = document.getElementById(
            'modal_post_parametros_desverdizado'
        ) as HTMLDialogElement
        if (dialogSetting) {
            dialogSetting.show()
        }
    }

    return (
        <div className="inventario-desverdizado-botones-container ">
            <div >
                <button onClick={handleClickParametros} className="vaciar" disabled={loading}>
                    Parametros
                </button>
            </div>
            <div>
                <button
                    onClick={(): void => {
                        if (props.select === undefined) return messageModal('error', 'Seleccione predio')
                        setShowConfirmation(true)
                    }}
                    className="add-record" disabled={loading} >
                    Finalizar
                </button>
            </div>

            <div>
                {props.select && <h3>{props.select.enf}</h3>}
            </div>
            <div>
                {props.select && <h3>{props.select.predio.PREDIO}</h3>}
            </div>
            <div>
                <h3>Canastillas Total:
                    {
                        props.data.reduce((acu, item) => acu += Number(item.inventarioDesverdizado) , 0)
                    }
                </h3>
            </div>
                        <div>
                <h3>Total:
                    {
                        props.data.reduce((acu, item) => acu += Number(item.inventarioDesverdizado) * item.promedio , 0)
                    } Kg
                </h3>
            </div>
            {showConfirmation && (
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmation}
                />
            )}
        </div>
    )
}
