/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import TablaHistorialDespachoDescarte from "./components/TablaHistorialDespachoDescarte";
import { despachoDescartesType } from "@renderer/types/despachoDescartesType";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import useAppContext from "@renderer/hooks/useAppContext";

export default function HistorialDespachoDescartes(): JSX.Element {
    const { setLoading } = useAppContext();
    const [page, setPage] = useState<number>(1);
    const {data, numeroElementos, obtenerCantidadElementos, obtenerData} = useFetchPaginatedList<despachoDescartesType>({
        page, 
        actionData: "get_inventarios_historiales_despachoDescarte",
        actionNumberData: "get_inventarios_historiales_numero_DespachoDescarte"
    });
    useEffect(()=>{
        const fetchData = async():Promise<void> => {
            try{
                setLoading(true)
                await obtenerData()
                await obtenerCantidadElementos()
            } catch(err){
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    },[])
    useEffect(() => {
        obtenerData()
    },[page])

    return (
        <div>
            <div className="navBar"></div>
            <h2>Historial despacho descarte</h2>
            <hr />
            <TablaHistorialDespachoDescarte data={data} obtenerData={obtenerData} />
            <div></div>
                <BotonesPasarPaginas
                    division={50}
                    page={page}
                    numeroElementos={numeroElementos}
                    setPage={setPage}
                />
        </div>
    )
}
