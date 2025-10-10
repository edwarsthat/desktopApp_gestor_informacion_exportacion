/* eslint-disable prettier/prettier */
import { createContext, useEffect, useState } from "react";
import GeneralInfo from "./components/GeneralInfo";
import { contenedoresType } from "@renderer/types/contenedoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import './css/styles.css'
    ;
import Resumen from "./components/Resumen";
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal";
import ListaEmpaquePredios from "./components/ListaEmpaquePredios";
import { obtenerDataContenedores, obtenerPredioProcesando } from "./services/request";
import { historialLotesType } from "@renderer/types/lotesType";
import Pallets from "./components/Pallets";
import { CuartoFrioType } from "@renderer/types/cuartosFrios";
import useListaEmpaqueStore from "./store/listaEmpaqueStore";
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";


export const contenedoresContext = createContext<contenedoresType[] | undefined>(undefined)
export const contenedorSeleccionadoContext = createContext<string | undefined>(undefined)
export const loteselectedContext = createContext<historialLotesType | undefined>(undefined)

export default function ProcesoListaEmpaque(): JSX.Element {
    const { messageModal, eventoServidor, triggerServer, setLoading } = useAppContext();
    const setContenedor = useListaEmpaqueStore(state => state.setContenedor);
    const contenedor = useListaEmpaqueStore(state => state.contenedor);

    const [contenedores, setContenedores] = useState<contenedoresType[]>();
    const [itemsPallet, setItemsPallet] = useState<itemPalletType[]>([])
    const [lotes, setLotes] = useState<historialLotesType[]>();

    const [showResumen, setShowResumen] = useState<boolean>(false)
    const [showPredios, setShowPredios] = useState<boolean>(false)
    const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [cuartosFrios, setCuartosFrios] = useState<CuartoFrioType[]>([])
    const [inventarioCuartosFrios, setInventarioCuartosFrios] = useState<string[]>([])

    useEffect(() => {
        if (
            eventoServidor === 'lista_empaque_update'
        ) {

            (async (): Promise<void> => {
                await obtenerDataContenedores(setContenedores)
                await obtenerPredioProcesando(setLotes)
                await obtenerCuartosFrios()

            })();
        }
    }, [triggerServer])

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                await obtenerDataContenedores(setContenedores)
                await obtenerPredioProcesando(setLotes)
                await obtenerCuartosFrios()

            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            }
        }
        fetchData()

    }, []);

    useEffect(() => {
        const _id = localStorage.getItem("proceso-listaempaque-id-contenedor")
        if (_id && contenedores !== undefined) {
            const contenedorSeleccionado = contenedores?.find(item => item._id === _id);

            if (contenedorSeleccionado) {
                setContenedor(contenedorSeleccionado)
                localStorage.removeItem("proceso-listaempaque-id-contenedor")
            }
        }
    }, [contenedores])

    useEffect(() => {
        if (confirm) {
            cerrarContenedor()
            setConfirm(false)
        }
    }, [confirm]);

    useEffect(() => {
        const fetchPalletItems = async (): Promise<void> => {
            try {
                if (contenedor === null) return
                const request = {
                    action: 'get_proceso_aplicaciones_listaEmpaque_itemsPallet',
                    contenedor: contenedor._id
                };
                const response = await window.api.server2(request);
                if (response.status !== 200)
                    throw new Error(`Code ${response.status}: ${response.message}`)
                setItemsPallet(response.data)

            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        if (contenedor !== null) {
            fetchPalletItems()
        }
    }, [contenedor])

    const handleShowResumen = (): void => {
        setShowResumen(!showResumen)
    }
    const handleShowPredios = (): void => {
        setShowPredios(!showPredios)
    }
    const handleCerrarContenedor = (): void => {
        setShowConfirmacion(true)
        setMessage("¿Desea cerrar el contenedor?")
    }

    const cerrarContenedor = async (): Promise<void> => {
        try {
            if (contenedor === undefined || contenedor === null)
                throw new Error("Error: contenedor no seleccionado")
            const request = {
                action: 'cerrar_contenedor',
                _id: contenedor._id
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Contenedor cerrado")
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerCuartosFrios = async (): Promise<void> => {
        try {
            const request = {
                action: "get_inventarios_cuartosFrios_listaEmpaque"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setCuartosFrios(response.data.infoCuartos)
            setInventarioCuartosFrios(response.data.inventarioTotal)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Lista de empaque</h2>
            <hr />
            <GeneralInfo
                lotes={lotes}
                showPredios={showPredios}
                handleShowPredios={handleShowPredios}
                handleCerrarContenedor={handleCerrarContenedor}
                showResumen={showResumen}
                handleShowResumen={handleShowResumen}
                contenedores={contenedores}
            />
            {showResumen && <Resumen pallets={itemsPallet} />}
            {showPredios && <ListaEmpaquePredios pallets={itemsPallet} />}

            {!showResumen && !showPredios && <Pallets itemsPallet={itemsPallet} cuartosFrios={cuartosFrios} inventarioCuartosFrios={inventarioCuartosFrios} />
            }
            {showConfirmacion &&
                <ConfirmacionModal
                    message={message}
                    setConfirmation={setConfirm}
                    setShowConfirmationModal={setShowConfirmacion} />}
        </div>
    )
}
