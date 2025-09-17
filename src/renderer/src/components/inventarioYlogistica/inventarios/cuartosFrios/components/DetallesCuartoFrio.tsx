/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { CuartoFrioType } from "@renderer/types/cuartosFrios"
import { useEffect, useState } from "react";
import { EF1Item } from "../types";
import { ImExit } from "react-icons/im";
import '../styles/DetallesCuartoFrio.css';

type propsType = {
    cuarto: CuartoFrioType
    filtroContenedor: string
    filtroPallet: string
}
export default function DetallesCuartoFrio({ cuarto, filtroContenedor, filtroPallet }: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [data, setData] = useState<EF1Item[]>([]);
    const [dataOriginal, setDataOriginal] = useState<EF1Item[]>([]);

    useEffect(() => {
        obtenerDetallesCuarto();
    }, [])

    useEffect(() => {
        let datosFiltrados = [...dataOriginal];
        if (filtroContenedor.trim() !== '') {
            datosFiltrados = datosFiltrados.filter(item => String(item.contenedor).toLowerCase().includes(filtroContenedor.toLowerCase()));
        }
        if (filtroPallet.trim() !== '') {
            datosFiltrados = datosFiltrados.filter(item => (item.pallet + 1).toString().includes(filtroPallet));
        }
        setData(datosFiltrados);
    }, [filtroContenedor, filtroPallet])

    const obtenerDetallesCuarto = async (): Promise<void> => {
        try {
            setLoading(true);
            const request = {
                action: "get_inventarios_cuartosFrios_detalles",
                data: cuarto
            }
            const response = await window.api.server2(request);

            if (response.status !== 200) {
                throw new Error(response.message || "Error en la solicitud");
            }
            setDataOriginal(response.data || []);
            setData(response.data || []);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    const darSalidaEnConjunto = async (): Promise<void> => {
        try {
            setLoading(true);
            const itemsIds = data.map(item => item._id.toString());
            const request = {
                action: "put_inventarios_cuartosFrios_salida_item",
                data: { itemsIds, cuartoId: cuarto._id }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message || "Error en la solicitud"}`);
            }
            messageModal("success", "Salida realizada con éxito");
            await obtenerDetallesCuarto();
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
                                <th><button onClick={darSalidaEnConjunto}>
                                    <ImExit />
                                </button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item._id} className="detalles-cuarto-frio-tabla-row">
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--contenedor">
                                        {item.contenedor}
                                    </td>
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--pallet">
                                        {item.pallet + 1}
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
                                    <td className="detalles-cuarto-frio-tabla-cell detalles-cuarto-frio-tabla-cell--acciones">
                                        <button className="detalles-cuarto-frio-tabla-cell--editar"><ImExit /></button>
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