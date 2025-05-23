/* eslint-disable prettier/prettier */

import { handleChangeForm } from "@renderer/controllers/formController"
import { useEffect, useState } from "react"
import { useRegistrosCanastillasData } from "./hooks/useRegistrosCanastillasData"
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas"
import { formatearFecha } from "@renderer/functions/fechas"

type filtroType = {
    fechaInicio?: string,
    fechaFin?: string
}


export default function HistorialInventarioCanastillas(): JSX.Element {
    const headers = ["Fecha", "Origen", "Destino", "Cantidad", "Acción", "Observaciones"]

    const [filtro, setFiltro] = useState<filtroType>()
    const [page, setPage] = useState<number>(1)

    const { numeroRegistros, obtenerRegistro, obtenerNumeroRegistros, registros } =
        useRegistrosCanastillasData({ filtro: filtro, page: page })

    useEffect(() => {
        obtenerRegistro();
        obtenerNumeroRegistros();
    }, [])

    useEffect(()=>{
        obtenerRegistro();
    },[page])

    const handleBuscar = async ():Promise<void> => {
        await obtenerRegistro()
        await obtenerNumeroRegistros()
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Historial Inventario Canastillas</h2>
            <hr />

            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <label>Fecha Inicio</label>
                    <input
                        type="date"
                        name="fechaInicio"
                        onChange={(e): void => handleChangeForm(e, setFiltro)}
                    />
                    <label>Fecha Fin</label>
                    <input
                        type="date"
                        name="fechaFin"
                        onChange={(e): void => handleChangeForm(e, setFiltro)}
                    />
                    <button onClick={handleBuscar}>Buscar</button>
                </div>
            </div>
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
                        {
                            registros && registros.map((item, index) => (
                                <tr key={item._id} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                    <td>{formatearFecha(item.createdAt)}</td>
                                    <td>{item.origen}</td>
                                    <td>{item.destino}</td>
                                    <td>{item.cantidad.propias}</td>
                                    <td>{item.tipoMovimiento}</td>
                                    <td>{item.observaciones}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <BotonesPasarPaginas
                page={page}
                setPage={setPage}
                numeroElementos={numeroRegistros}
                division={50}
            />
        </div>
    )
}