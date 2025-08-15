/* eslint-disable prettier/prettier */
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { indicadoresType } from "@renderer/types/indicadoresType";
import { useEffect, useState } from "react"
import { PiNotePencilDuotone } from "react-icons/pi";
import ModalRegistroEficienciaOperativa from "./components/ModalRegistroEficienciaOperativa";
import { nombreTipoFruta2 } from "@renderer/utils/tipoFrutas";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";

const headers = [
    "Fecha",
    "Tipo de fruta procesada",
    "Kilos procesados",
    "Duracion turno (horas)",
    "Meta kilos procesados (hora)",
    ""
]


export default function RegistrosEficienciaOperativa(): JSX.Element {
    const [page, setPage] = useState<number>(1);
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta);
    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<indicadoresType>({
        actionData: "get_indicadores_operaciones_eficienciaOperativa",
        actionNumberData: "get_indicadores_proceso_numero_items",
        page: page
    })

    const [open, setOpen] = useState<boolean>(false);
    const [itemSeleccionado, setItemSeleccionado] = useState<indicadoresType>()

    useEffect(() => {
        obtenerCantidadElementos()
    }, []);
    useEffect(() => {
        if (!open) {
            obtenerData()
        }
    }, [page, open])

    const getTipoFruta = (registro: indicadoresType): string => {
        const tipos:string[] = []
        if (registro.kilos_procesados && Object.keys(registro.kilos_procesados).length > 0) {
            for(const tipoId of Object.keys(registro.kilos_procesados)){
                const nombreFruta: string = nombreTipoFruta2(tipoId, tiposFruta);
                if (nombreFruta) {
                    tipos.push(nombreFruta);
                }
            }
            return tipos.join(" - ");
        }
        return ''
    }

    const kilosProcesadosTotal = (registro: indicadoresType): number => {
        if (registro.kilos_vaciados && Object.keys(registro.kilos_vaciados).length > 0) {
            return Object.values(registro.kilos_vaciados).reduce((acc, kilos) => acc + kilos, 0);
        }
        return 0
    }


    if (!data) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros indicadores eficiencia operativa</h2>
            <hr />
            <div className="table-container">
                <table className="table-main">
                    <thead>
                        <tr>
                            {headers.map(item => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((registro, index) => (
                            <tr key={registro._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                <td>{formatearFecha(registro.fecha_creacion)}</td>
                                <td>{getTipoFruta(registro)}</td>
                                <td>{kilosProcesadosTotal(registro).toFixed(2)} Kg</td>
                                <td>{registro.duracion_turno_horas}</td>
                                <td>{registro?.kilos_meta_hora?.toFixed(2) || 0}</td>
                                <td>
                                    <div
                                        onClick={(): void => {
                                            setItemSeleccionado(registro);
                                            setOpen(true);
                                            // setModificando(true);
                                        }}
                                        style={{ color: 'blue' }}>
                                        < PiNotePencilDuotone />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModalRegistroEficienciaOperativa open={open} onClose={(): void => setOpen(false)} select={itemSeleccionado} />
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage}
            />
        </div>
    )
}