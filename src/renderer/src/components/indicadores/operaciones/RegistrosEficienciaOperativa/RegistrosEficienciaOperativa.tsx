/* eslint-disable prettier/prettier */
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext"
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import { indicadoresType } from "@renderer/types/indicadoresType";
import { useEffect, useState } from "react"
import { PiNotePencilDuotone } from "react-icons/pi";

const headers = [
    "Fecha",
    "Tipo de fruta procesada",
    "Kilos procesados",
    "Horas hombre",
    "Meta kilos procesados",
    ""
]

type formStateType = {
    total_horas_hombre?: string
    meta_kilos_procesados?: string
}
export default function RegistrosEficienciaOperativa(): JSX.Element {
    const { messageModal } = useAppContext();
    const [page, setPage] = useState<number>(1);

    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<indicadoresType>({
        actionData: "get_indicadores_operaciones_eficienciaOperativa",
        actionNumberData: "get_inventarios_numero_registros_fruta_descompuesta",
        page: page
    })

    const [itemSeleccionado, setItemSeleccionado] = useState<indicadoresType>()
    const [formState, setFormState] = useState<formStateType>()


    useEffect(() => {
        obtenerCantidadElementos()
    }, []);
    useEffect(() => {
        obtenerData()
    }, [page])

    // const modificarDataServidor = async (): Promise<void> => {
    //     try {
    //         if (formState?.total_horas_hombre) {
    //             if (formState.total_horas_hombre && isNaN(Number(formState.total_horas_hombre))) {
    //                 throw new Error("Horas hombre debe ser un número");
    //             }
    //         }
    //         if (formState?.meta_kilos_procesados) {
    //             if (formState.meta_kilos_procesados && isNaN(Number(formState.meta_kilos_procesados))) {
    //                 throw new Error("Meta kilos procesados debe ser un número");
    //             }
    //         }
    //         const query = {
    //             action: "put_indicadores_operaciones_eficienciaOperativa",
    //             data: formState,
    //             _id: itemSeleccionado?._id
    //         }
    //         const response = await window.api.server2(query);
    //         if (response.status !== 200) {
    //             throw new Error(`Code ${response.status}: ${response.message}`);
    //         }
    //         messageModal("success", "Registro modificado correctamente");
    //         await obtenerCantidadElementos();
    //         setModificando(false);
    //         setFormState(undefined);
    //         setItemSeleccionado(undefined);
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             messageModal("error", error.message);
    //         }
    //     }
    // }
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
                                <td>{registro.tipo_fruta.reduce((acu, item) => acu += item + ', ', '')}</td>
                                <td>{registro.kilos_procesados?.toFixed(2) ?? 0}</td>
                                <td>{registro.total_horas_hombre}</td>
                                <td>{registro.meta_kilos_procesados}</td>
                                <td>
                                    <div
                                        style={{ color: 'blue' }}>
                                        < PiNotePencilDuotone />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BotonesPasarPaginas
                division={50}
                page={page}
                numeroElementos={numeroElementos}
                setPage={setPage}
            />
        </div>
    )
}