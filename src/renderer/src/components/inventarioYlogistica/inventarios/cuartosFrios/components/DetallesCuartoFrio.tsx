/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { CuartoFrioType } from "@renderer/types/cuartosFrios"
import { useEffect, useState } from "react";
import { EF1Item } from "../types";
import '../styles/DetallesCuartoFrio.css';

type propsType = {
    cuarto: CuartoFrioType
}
export default function DetallesCuartoFrio({ cuarto }:propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<EF1Item[]>([]);
    useEffect(()=>{
        obtenerDetallesCuarto();
    },[])
    const obtenerDetallesCuarto = async (): Promise<void> => {
        try{
            setLoading(true);
            const request = {
                action: "get_inventarios_cuartosFrios_detalles",
                data: cuarto
            }
            const response = await window.api.server2(request);

            if (response.status !== 200) {
                throw new Error(response.message || "Error en la solicitud");
            }
            setData(response.data || []);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="detalles-cuarto-frio-container">
            <h3 className="detalles-cuarto-frio-title">Detalles del Cuarto Frío</h3>
            
            <div className="detalles-cuarto-frio-info">
                <p className="detalles-cuarto-frio-nombre">Nombre: {cuarto.nombre}</p>
            </div>

            {data.length === 0 ? (
                <div className="detalles-cuarto-frio-empty">
                    No hay elementos almacenados en este cuarto frío
                </div>
            ) : (
                <div className="detalles-cuarto-frio-tabla-container">
                    <table className="detalles-cuarto-frio-tabla">
                        <thead className="detalles-cuarto-frio-tabla-header">
                            <tr>
                                <th>Contenedor</th>
                                <th>Pallet</th>
                                <th>Lote ENF</th>
                                <th>Predio</th>
                                <th>Tipo Caja</th>
                                <th>Cajas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item._id} className="detalles-cuarto-frio-tabla-row">
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--contenedor">
                                        {item.contenedor}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--pallet">
                                        {item.pallet}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--lote">
                                        {item.lote.enf}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--predio">
                                        {item.lote.predio}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--tipo-caja">
                                        {item.tipoCaja}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--cajas">
                                        {item.cajas}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}