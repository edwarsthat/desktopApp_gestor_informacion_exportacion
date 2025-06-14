/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList"
import { useEffect, useState } from "react"

export default function TransporteRegistroEntregaPrecinto(): JSX.Element {
    const {setLoading, loading} = useAppContext();
    const [ page, setPage] = useState<number>(1)
    const {obtenerCantidadElementos, obtenerData, data} = useFetchPaginatedList({
        actionData:"get_transporte_registros_entregaPrecintos",
        actionNumberData:"get_transporte_registros_entregaPrecintos_numeroElementos",
        page:page
    })
    useEffect(()=>{
        const fetchData = async (): Promise<void> => {
            try{
                setLoading(true);
                await obtenerCantidadElementos();
                await obtenerData();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    },[])
    useEffect(()=>{
        try{
        setLoading(true);
        obtenerData();
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    },[page])
    return (
        <div>
            <div className="navBar"></div>
            <h2>Registro entrega precinto</h2>
            <hr />
        </div>
    )
}
