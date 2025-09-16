/* eslint-disable prettier/prettier */
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";
import useAppContext from "@renderer/hooks/useAppContext";

type propsType = { 
    itemSeleccionadoID?: string
    itemId: string
    handleModificar: (id: string) => void
    handleAceptar: () => void
    handleCancelar: () => void
    disabled?: boolean
}

export default function BotonesSeleccionarItemTabla(props: propsType): JSX.Element {
    const { loading } = useAppContext();
    const isDisabled = props.disabled || loading;
    
    return (
        <td>
            {(props.itemSeleccionadoID !== props.itemId) &&
                <button
                    style={{ color: props.disabled ? "#ccc" : "blue" }}
                    disabled={props.disabled}
                    onClick={(): void => props.handleModificar(props.itemId)}>
                    <PiNotePencilDuotone />
                </button>}
            {(props.itemSeleccionadoID === props.itemId) &&
                    <button disabled={isDisabled} style={{ color: 'green' }} onClick={props.handleAceptar} >
                    <IoSaveSharp />
                </button>}
            {(props.itemSeleccionadoID === props.itemId) &&
                <button disabled={isDisabled} style={{ color: 'red' }} onClick={props.handleCancelar}>
                    <GiCancel />
                </button>}
        </td>
    )
}