/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react";
import { precioProveedorType } from "@renderer/types/preciosTypes";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import useGetSysData from "@renderer/hooks/useGetSysData";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import TarjetaRegistroPrecios from "./components/TarjetaRegistroPrecios";
import './css/cardPrecios.css'
import ModalIngresarComentario from "./components/ModalIngresarComentario";

export type filtroType = {
    fechaInicio: string
    fechaFin: string
    tipoFruta: string
    proveedor: string
}

export default function RegistrosPreciosProveedores(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const { proveedores, obtenerPredios } = useGetSysData({});
    const { setCurrentFilters, currentFilters } = useFiltroValue();
    const [page, setPage] = useState<number>(1)
    const [open, setOpen] = useState<boolean>(false);
    const [item, setItem] = useState<precioProveedorType | undefined>(undefined);

    const { obtenerCantidadElementos, obtenerData, data, numeroElementos } = useFetchPaginatedList<precioProveedorType>({
        actionData: "get_comercial_precios_registros_precios_proveedores",
        actionNumberData: "get_comercial_precios_registros_precios_proveedores_numeroElementos",
        page: page,
        filtro: currentFilters
    })

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerPredios()
                await obtenerCantidadElementos()
                await obtenerData()
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        try {
            setLoading(true);
            console.log("Fetching data...");
            obtenerData();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    }, [page])


    return (
        <div>
            <div className="navBar"></div>
            <h2>Registros Precios</h2>
            <hr />

            <Filtros
                showFechaInicio={true}
                showFechaFin={true}
                showTipoFruta2={true}
                showProveedor={true}
                showButton={true}
                allId="comercial-registroProveedores-registroPrecios"
                findFunction={obtenerData}
                onFiltersChange={setCurrentFilters} />

            <div className="precios-container">
                <div className="cards-grid">
                    {(data || []).map(item => (
                        <TarjetaRegistroPrecios 
                            key={item._id+"precios-container"} 
                            item={item} 
                            proveedores={proveedores} 
                            setOpen={setOpen} 
                            setItem={setItem} />
                    ))}
                </div>
            </div>

                    <ModalIngresarComentario 
                        open={open}
                        onClose={(): void => { setOpen(false); setItem(undefined); }}
                        data={item}
                        obtenerPrecios={obtenerData}
                    />

            <BotonesPasarPaginas
                setPage={setPage}
                page={page}
                numeroElementos={numeroElementos}
                division={50} />
        </div >
    )
}