/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import TablaHistorialListaEmpaque from "./components/TablaHistorialListaEmpaque";
import InfoListaEmpaque from "./components/InfoListaEmpaque";
import './styles/styles.css'
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import useGetSysData from "@renderer/hooks/useGetSysData";

export default function HistorialListaEmpaque(): JSX.Element {
    const [page, setPage] = useState<number>(1)

    const {
        numeroElementos,
        data,
        obtenerData,
        obtenerCantidadElementos
    } = useFetchPaginatedList<contenedoresType>({
        page,
        actionData: "get_inventarios_historiales_listasDeEmpaque",
        actionNumberData: "get_inventarios_historiales_listasDeEmpaque_numeroRegistros"
    })
    const { proveedores } = useGetSysData({})

    const [showTable, setShowTable] = useState<boolean>(true)
    const [contenedor, setContenedor] = useState<contenedoresType>()

    useEffect(() => {
        console.log("asasdas")
        obtenerData()
        obtenerCantidadElementos()
    }, [page])

    const handleAccederDocumento = (cont: contenedoresType): void => {
        setShowTable(false)
        setContenedor(cont)
    }
    const handleVolverTabla = (): void => {
        setShowTable(true)
    }
    return (
        <div>
            <div className="navBar"></div>
            <h2>Historial listas empaque</h2>
            <hr />

            {showTable ?
                <TablaHistorialListaEmpaque handleAccederDocumento={handleAccederDocumento} data={data} />
                :
                <InfoListaEmpaque
                    proveedores={proveedores}
                    handleVolverTabla={handleVolverTabla}
                    contenedor={contenedor} />
            }
            {showTable &&

                <BotonesPasarPaginas
                    division={50}
                    page={page}
                    numeroElementos={numeroElementos}
                    setPage={setPage}
                />
            }
        </div>
    )
}
