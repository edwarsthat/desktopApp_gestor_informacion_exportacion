/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect, useState } from "react";
import './styles.css'
import ListaProveedores from "./components/ListaProveedores";
import PreciosComponent from "./components/PreciosComponent";
import useGetSysData from "@renderer/hooks/useGetSysData";
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";

export default function PreciosProveedores(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const tiposFrutas = useTipoFrutaStore((state) => state.tiposFruta);
    const { proveedores, obtenerPredios } = useGetSysData({});
    const [selectedProveedores, setSelectedProveedores] = useState<proveedoresType[]>();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true)
                await Promise.all([
                    obtenerPredios(),
                ]);
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        };
        fetchData()
    }, [])

    return (
        <div>
            <div className="navBar"></div>
            <h2>Precios</h2>
            <hr />
            <div className="comercial-precios-container">
                <div className="comercial-precios-contenedor-proveedores">
                    <ListaProveedores
                        setProveedores={obtenerPredios}
                        selectedProveedores={selectedProveedores}
                        setSelectedProveedores={setSelectedProveedores}
                        proveedores={proveedores}
                        tiposFrutas={tiposFrutas} />
                </div>
                <div className="comercial-precios-contenedor-precios">
                    <PreciosComponent
                        setSelectedProveedores={setSelectedProveedores}
                        selectedProveedores={selectedProveedores}
                        tiposFrutas={tiposFrutas} />
                </div>
            </div>
        </div>
    )
}