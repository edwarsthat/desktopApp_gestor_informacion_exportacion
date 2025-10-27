/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import TablaHistorialListaEmpaque from "./components/TablaHistorialListaEmpaque";
import InfoListaEmpaque from "./components/InfoListaEmpaque";
import './styles/styles.css'
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import { useFetchPaginatedList } from "@renderer/hooks/useFetchPaginatedList";
import useAppContext from "@renderer/hooks/useAppContext";
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";

export default function HistorialListaEmpaque(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
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
    const [itemsPallet, setItemsPallet] = useState<itemPalletType[]>([])
    const [showTable, setShowTable] = useState<boolean>(true)
    const [contenedorSeleccionado, setContenedorSeleccionado] = useState<contenedoresType | null>(null)

    useEffect(() => {
        obtenerData()
        obtenerCantidadElementos()
    }, [page])

    const handleAccederDocumento = async (cont: contenedoresType): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_inventarios_historiales_listasDeEmpaque_itemPallets",
                contenedor: cont._id
            }
            const response = await window.api.server2(request)
            if (response.error) {
                throw new Error(`Code ${response.status} : ${response.message}`)
            }
            console.log(response)
            setItemsPallet(response.data)
            setShowTable(false)
            setContenedorSeleccionado(cont)
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message)
            }
        } finally {
            setLoading(false)
        }
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
                    contenedorSeleccionado={contenedorSeleccionado}
                    handleVolverTabla={handleVolverTabla}
                    items={itemsPallet} />
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
