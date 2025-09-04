/* eslint-disable prettier/prettier */
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore";
import { useEffect, useState } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import "../styles/filstros.css";
import useGetSysData from "@renderer/hooks/useGetSysData";

type propsType = {
    handlebuscar: (
        numeroContenedor: string[],
        fechainicio:string | undefined,
        fechaFin:string | undefined,
        clientes: string[],
        tipoFruta:string
    ) => void;
}

export default function CostosContenedoresFiltros(props:propsType): JSX.Element {
    const { obtenerClientes, clientes } = useGetSysData({});
    const tiposFrutas = useTipoFrutaStore(state => state.tiposFruta);
    const [inputNumeroContenedor, setInputNumeroContenedor] = useState<string>()
    const [arrContenedores, setArrContenedores] = useState<string[]>([]);
    const [fechaInicio, setFechaInicio] = useState<string>();
    const [fechaFin, setFechaFin] = useState<string>();
    const [clientesCheck, setClientesCheck] = useState<string[]>([]);
    const [tipoFruta, settipoFruta] = useState<string>("");
    useEffect(() => {
        obtenerClientes()
    }, [])
    const addNumeroContenedor = (): void => {
        if (inputNumeroContenedor !== undefined)
            setArrContenedores([...arrContenedores, inputNumeroContenedor])
    }
    const eliminarNumeroContenedor = (cont: string): void => {
        setArrContenedores(prev => {
            const newArr = prev.filter(item => !(item === cont))
            return newArr
        })
    }
    const handleClientesCheck = (e): void => {
        setClientesCheck([...clientesCheck, e])
    }
    const handleEliminarClientesCheck = (cliente:string): void => {
        setClientesCheck(prev => {
            const newArr = prev.filter(item => !(item === cliente))
            return newArr
        })
    }
    const handleBuscar = ():void => {
        props.handlebuscar(
            arrContenedores,
            fechaInicio,
            fechaFin,
            clientesCheck,
            tipoFruta
        )
    }

    return (
        <section className="costos-contenedores-filtros">
            <div className="filtro-section">
                <h3>Busqueda por numero de contenedor</h3>
                <hr />
                <div className="busqueda-contenedor-container">
                    <div className="busqueda-contenedor-div1">
                        <input
                            onChange={(e): void => setInputNumeroContenedor(e.target.value)}
                            type="text" 
                            placeholder="Ingrese número de contenedor"
                        />
                        <button onClick={addNumeroContenedor} >
                            <IoAddCircleSharp />
                        </button>
                    </div>
                    <div className="busqueda-contenedor-div3">
                        {arrContenedores.map(cont => (
                            <button
                                onClick={(): void => eliminarNumeroContenedor(cont)}
                                key={cont} 
                            >
                                {cont}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="filtro-section">
                <h3>Busqueda por fecha</h3>
                <hr />
                <div className="busqueda-fecha-container">
                    <div className="busqueda-fecha-item">
                        <label>
                            Fecha Inicio
                            <input onChange={(e): void => setFechaInicio(e.target.value)} type="date"  />
                        </label>
                    </div>
                    <div className="busqueda-fecha-item">
                        <label>
                            Fecha Fin
                            <input onChange={(e): void => setFechaFin(e.target.value)} type="date" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="filtro-section">
                <h3>Busqueda por cliente</h3>
                <hr />
                <div className="busqueda-cliente-container">
                    <div className="busqueda-cliente-select">
                        <select multiple onChange={(e): void => handleClientesCheck(e.target.value)}>
                            {clientes && clientes.map(item => (
                                <option value={item._id} key={item._id}>
                                    {item.CLIENTE}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="busqueda-cliente-tags">
                        {clientes && clientesCheck.map(cont => (
                            <button
                                onClick={(): void => handleEliminarClientesCheck(cont)}
                                key={cont}
                            >
                                {clientes.find(cliente => cliente._id === cont)?.CLIENTE}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
            <div className="filtro-section">
                <h3>Tipo de fruta</h3>
                <hr />
                <div className="tipo-fruta-container">
                    <select onChange={(e):void => settipoFruta(e.target.value)}>
                        <option value="">Seleccione un tipo de fruta</option>
                        {tiposFrutas && tiposFrutas.map(item => (
                            <option value={item._id} key={item._id + "Historial_contenedores"}>
                                {item.tipoFruta}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="buscar-button-container">
                <button onClick={handleBuscar} >Buscar</button>
            </div>
        </section>
    )
}
