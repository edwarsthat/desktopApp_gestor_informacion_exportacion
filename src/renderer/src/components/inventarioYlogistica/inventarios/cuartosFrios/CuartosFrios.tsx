/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { CuartoFrioType } from "@renderer/types/cuartosFrios";
import { useEffect, useState } from "react";
import CuartoFrioPrimaryCard from "./components/CuartoFrioPrimaryCard";
import './styles/CuartosFrios.css';
import DetallesCuartoFrio from "./components/DetallesCuartoFrio";

export default function CuartosFrios(): JSX.Element {
    const { messageModal, setLoading, eventoServidor, triggerServer } = useAppContext();
    const [data, setData] = useState<CuartoFrioType[]>([]);
    const [totalData, setTotalData] = useState<{ cajas: number, kilos: number }>({ cajas: 0, kilos: 0 });
    const [cuartoSeleccionado, setCuartoSeleccionado] = useState<CuartoFrioType | null>(null);

    const [filtroContenedor, setFiltroContenedor] = useState<string>('');
    const [filtroPallet, setFiltroPallet] = useState<string>('');



    useEffect(() => {
        obtenerData();
    }, [])

    useEffect(() => {
        if (eventoServidor !== 'lista_empaque_update') return;

        (async (): Promise<void> => {
            const nuevos = await obtenerData();
            if (cuartoSeleccionado && nuevos) {
                const actualizado = nuevos.find(c => c._id === cuartoSeleccionado._id) || null;
                setCuartoSeleccionado(actualizado);
            }
        })();
    }, [triggerServer, eventoServidor]);

    useEffect(() => {
        if (cuartoSeleccionado) return;

        const totales = { kilos: 0, cajas: 0 };

        (data ?? []).forEach((cuarto: CuartoFrioType) => {
            Object.values(cuarto?.totalFruta ?? {}).forEach(cantidades => {
                totales.kilos += cantidades?.kilos ?? 0;
                totales.cajas += cantidades?.cajas ?? 0;
            });
        })
        setTotalData(totales);
    }, [cuartoSeleccionado])

    const obtenerData = async (): Promise<CuartoFrioType[] | undefined> => {
        try {
            setLoading(true);
            const request = {
                action: "get_inventarios_cuartosFrios",
                query: {}
            }
            const response = await window.api.server2(request);

            if (response.status !== 200) {
                throw new Error(response.message || "Error en la solicitud");
            }

            const arr: CuartoFrioType[] = response.data || [];
            setData(arr);
            const totales = { kilos: 0, cajas: 0 };

            (arr ?? []).forEach((cuarto: CuartoFrioType) => {
                Object.values(cuarto?.totalFruta ?? {}).forEach(cantidades => {
                    totales.kilos += cantidades?.kilos ?? 0;
                    totales.cajas += cantidades?.cajas ?? 0;
                });
            })
            setTotalData(totales);
            return arr;

        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
            return []
        } finally {
            setLoading(false);
        }
    }
    const handleSeleccionarCuarto = (cuarto: CuartoFrioType): void => {
        setCuartoSeleccionado(cuarto);
    }

    return (
        <div >
            <div className="navBar"></div>
            <h2 className="cuartos-frios-title">Cuartos Fríos</h2>
            <hr className="cuartos-frios-divider" />

            <div className="cuartos-frios-filters-section">
                {cuartoSeleccionado && (
                    <div className="cuartos-frios-filters-container">
                        <div className="cuartos-frios-filter-input-group">
                            <label htmlFor="contenedor">Contenedor</label>
                            <input
                                onChange={(e): void => setFiltroContenedor(e.target.value)}
                                id="contenedor"
                                className="cuartos-frios-filter-input"
                                type="text"
                                placeholder="Buscar por contenedor..."
                            />
                        </div>
                        <div className="cuartos-frios-filter-input-group">
                            <label htmlFor="pallet">Pallet</label>
                            <input
                                onChange={(e): void => setFiltroPallet(e.target.value)}
                                id="pallet"
                                className="cuartos-frios-filter-input"
                                type="text"
                                placeholder="Buscar por pallet..."
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="cuartos-frios-totals">
                <div className="cuartos-frios-totals-title">
                    Total en todos los cuartos fríos
                </div>
                <div className="cuartos-frios-totals-values">
                    <div className="cuartos-frios-total-item cuartos-frios-total-item--cajas">
                        <span className="cuartos-frios-total-number">{totalData.cajas.toFixed(2)}</span>
                        <span>cajas</span>
                    </div>
                    <div className="cuartos-frios-total-item cuartos-frios-total-item--kilos">
                        <span className="cuartos-frios-total-number">{totalData.kilos}</span>
                        <span>kg</span>
                    </div>
                </div>
            </div>

            {cuartoSeleccionado && (
                <div className="cuartos-frios-back-button-container">
                    <button
                        className="cuartos-frios-back-button"
                        onClick={(): void => setCuartoSeleccionado(null)}
                    >
                        Atrás
                    </button>
                </div>
            )}

            {!cuartoSeleccionado && data && data.length > 0 ? (
                <div className="cuartos-frios-cards-grid">
                    {data.map((cuarto) => (
                        <CuartoFrioPrimaryCard key={cuarto._id} cuarto={cuarto} handleSeleccionarCuarto={handleSeleccionarCuarto} />
                    ))}
                </div>
            ) : (
                <div>
                    {!cuartoSeleccionado ? (
                        <div className="cuartos-frios-empty-state">
                            No hay cuartos fríos disponibles
                        </div>
                    ) : (
                        <div className="cuartos-frios-empty-state">
                            <DetallesCuartoFrio
                                setTotalData={setTotalData}
                                setFiltroContenedor={setFiltroContenedor}
                                setFiltroPallet={setFiltroPallet}
                                cuarto={cuartoSeleccionado}
                                filtroContenedor={filtroContenedor}
                                filtroPallet={filtroPallet}
                            />
                        </div>
                    )

                    }
                </div>
            )}
        </div>
    )
}