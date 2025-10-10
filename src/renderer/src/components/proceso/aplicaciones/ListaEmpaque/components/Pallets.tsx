/* eslint-disable prettier/prettier */


import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import { CuartoFrioType } from "@renderer/types/cuartosFrios";
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";
import { formatearFecha } from "@renderer/functions/fechas";

const headers = [
    "Pallet",
    "Lote",
    "Predio",
    "Calidad",
    "T. Caja",
    "Calibre",
    "Cajas",
    "Fecha",
    "",
    ""
]

type propsType = {
    cuartosFrios: CuartoFrioType[]
    inventarioCuartosFrios: string[]
    itemsPallet: itemPalletType[]
}

export default function Pallets({ itemsPallet }: propsType): JSX.Element {
    return (
        <div>
            <div className="table-container">
                <table className='table-main'>
                    <thead>
                        <tr >
                            {headers.map((item, index) => (
                                <th key={item + index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {itemsPallet && itemsPallet.map((item, index) => (
                            <tr key={"pallet" + index + item._id} className={item.pallet.numeroPallet % 2 === 0 ? 'fondo-par' : 'fondo-impar'}>
                                <td>{item.pallet.numeroPallet}</td>
                                <td>{item.lote.enf}</td>
                                <td>{item.lote.predio.PREDIO}</td>
                                <td>{item.calidad.nombre}</td>
                                <td>{item.tipoCaja}</td>
                                <td>{item.calibre}</td>
                                <td>{item.cajas}</td>
                                <td>{formatearFecha(item.fecha)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
{/* 
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />} */}

            {/* <ModalCuartoFrio
                inventarioCuartosFrios={inventarioCuartosFrios}
                contenedor={contenedor}
                pallet={palletSeleccionado}
                open={openModalCuartoFrio}
                onClose={(): void => setOpenModalCuartoFrio(false)}
                cuartoFrios={cuartosFrios}
            /> */}
        </div>
    )
}
