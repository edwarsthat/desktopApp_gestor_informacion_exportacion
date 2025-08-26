/* eslint-disable prettier/prettier */

import { filtroColumnasType } from "../type/types"
import { KEYS_FILTROS_COL } from "../functions/constantes"
import { lotesType } from "@renderer/types/lotesType"
import { promedio_data } from "@renderer/functions/resumenlotes"
import { promedioExportacion } from "@renderer/functions/operacionesLotes"

type propsType = {
    columnVisibility: filtroColumnasType
    data: lotesType[]
}

export default function PromediosProceso(props: propsType): JSX.Element {
    return (
        <div className="componentContainer">
            <div className="lotes-proceso-promedios-div">
                <h3>Promedios</h3>
                <div className="lotes-proceso-promedios-div2">
                    {Object.keys(props.columnVisibility).map((item, index) => {
                        if (!props.columnVisibility[item]) {
                            return null
                        }
                        if (['placa', 'calibreExportacion', 'observaciones', 'contenedores', "exportacionCalidad"].includes(item)) {
                            return null
                        }
                        else if (item === 'exportacion') {
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {promedioExportacion(props.data).toFixed(2)}</p>)
                        }
                        else {
                            return (<p key={index}>{KEYS_FILTROS_COL[item]}: {promedio_data(props.data, item).toFixed(2)}</p>)
                        }

                    })}
                </div>
            </div>
        </div>
    )
}
