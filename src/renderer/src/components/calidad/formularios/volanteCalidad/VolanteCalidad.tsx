/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { registrosType } from "./type/type"
import TablaVolantecalidad from "./table/TablaVolantecalidad"
import { FaCircleArrowRight } from "react-icons/fa6";
import TableResumenVolanteCalidad from "./table/TableResumenVolanteCalidad"
import Graficas from "./components/Graficas"
import useAppContext from "@renderer/hooks/useAppContext"
import "./css/styles.css"
import useGetSysData from "@renderer/hooks/useGetSysData";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";

export default function VolanteCalidad(): JSX.Element {
    const { messageModal, setLoading } = useAppContext()
    const { obtenerOperarios, operarios, tiposFruta2, obtenerTipoFruta2 } = useGetSysData({});
    const { setCurrentFilters, currentFilters } = useFiltroValue();

    const [data, setData] = useState<registrosType[]>([])
    const [operario, setOperario] = useState<string>("")
    const [showResume, setShowResume] = useState<boolean>(true)

    useEffect((): void => {
        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                await obtenerOperarios();
                await obtenerTipoFruta2();
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    const obtenerDatos = async (): Promise<void> => {
        try {
            const request = {
                action: 'get_calidad_formulario_volanteCalidad',
                filtro: {
                    ...currentFilters,
                    operario: operario
                }
            }
            const response = await window.api.server2(request);
            console.log("response", response)
            if (response.status !== 200) {
                throw new Error(response.message)
            }
            setData(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }

    return (
        <div >
            <div className="navBar"></div>
            <h2>Volante calidad</h2>
            <hr />
            <div className="filtroContainer">
                <div>
                    <select onChange={(e): void => setOperario(e.target.value)} value={operario} >
                        <option value=""></option>
                        {operarios.map(operario => (
                            <option key={operario._id} value={operario._id}>
                                {operario.nombre} {operario.apellido}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <Filtros
                showFechaInicio={true}
                showFechaFin={true}
                showTipoFruta={true}
                showButton={true}
                findFunction={obtenerDatos}
                ggnId="volanteCalidad"
                onFiltersChange={setCurrentFilters}
            />

            <div >
                <div className="volante-calidad-div-graficas">
                    <Graficas data={data} />
                </div>
            </div>
            <div className="volante-calidad-div-botones-cambio-tabla">
                {showResume ?
                    <button onClick={(): void => setShowResume(!showResume)} className="volante-calidad-boton-cambio-tabla">
                        <span>
                            Resumen
                        </span>
                        <span >
                            <FaCircleArrowRight />
                        </span>
                    </button>
                    :
                    <button
                        onClick={(): void => setShowResume(!showResume)} className="volante-calidad-boton-cambio-tabla">
                        <span >
                            Tabla
                        </span>
                        <span>
                            <FaCircleArrowRight />
                        </span>
                    </button>
                }
            </div>
            {showResume ?
                <div >
                    <TableResumenVolanteCalidad data={data} />
                </div> : <div>
                    <TablaVolantecalidad data={data} tipoFruta2={tiposFruta2} />
                </div>
            }

        </div>

    )
}
