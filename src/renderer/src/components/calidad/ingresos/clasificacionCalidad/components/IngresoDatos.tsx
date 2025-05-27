/* eslint-disable prettier/prettier */
import { useState } from "react";
import { elementoDefectoType } from "../types/clasificacionTypes";


type propsType = {
    setDataArray: React.Dispatch<React.SetStateAction<elementoDefectoType[]>>
    dataDefectos: object
    dataArray: elementoDefectoType[]
}

export default function IngresoDatos(props: propsType): JSX.Element {
    const [defecto, setDefecto] = useState<string>('');
    const [lavado, setLavado] = useState<string>('');
    const [encerado, setEncerado] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleAgregar = (): void => {
        // Validar si se repite el defecto
        if (props.dataArray.some(item => item.defecto === defecto)) {
            setError("¡Ese defecto ya fue agregado!");
            return;
        }
        setError("");
        const newElement = {
            defecto: defecto,
            lavado: Number(lavado),
            encerado: Number(encerado)
        }
        props.setDataArray(prev => {
            const newArray = [...prev];
            newArray.push(newElement);
            return newArray;
        })
        setLavado('')
        setEncerado('')
    }
    return (
        <div className="container-add-defecto">
            <select placeholder="Defecto" onChange={(e): void => setDefecto(e.target.value)} className="defaultSelect">
                <option value={''}>Defecto</option>
                {Object.keys(props.dataDefectos)
                    .filter(key => !props.dataArray.some(item => item.defecto === key))
                    .map(key => (
                        <option key={key} value={key}>{props.dataDefectos[key]}</option>
                    ))}
            </select>
            <input className="defaultSelect" type="number" placeholder="Lavado" onChange={(e): void => setLavado(e.target.value)} value={lavado} />
            <input className="defaultSelect" type="number" placeholder="Encerado" onChange={(e): void => setEncerado(e.target.value)} value={encerado} />
            <button onClick={handleAgregar} className="defaulButtonAgree">Agregar</button>
            {error && <span style={{ color: "red", fontSize: "0.92em" }}>{error}</span>}
        </div>
    )
}
