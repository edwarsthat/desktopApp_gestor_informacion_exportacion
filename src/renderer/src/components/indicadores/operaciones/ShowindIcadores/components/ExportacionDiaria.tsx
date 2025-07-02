/* eslint-disable prettier/prettier */

import { useEffect } from "react"
import { itemExportacionType } from "../validations/types"

type propsType = {
    data: itemExportacionType[]
}

export default function ExportacionDiaria({
    data
}:propsType): JSX.Element {

    useEffect(() => {
        
    }, []);

    return (
        <div className="indicadores-operaciones-eficiencia-operativa-container">
            <div className="item1">\
                <div className="table-container">
                </div>
            </div>
        </div>
    )
}