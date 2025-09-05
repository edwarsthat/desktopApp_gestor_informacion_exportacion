/* eslint-disable prettier/prettier */

import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react"
import { fechasSeleccionarDia } from "@renderer/functions/resumenContenedores"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { nombreTipoFruta2, tipoCalidad } from "@renderer/utils/tipoFrutas"
import { resultadoObtenerresumenContenedores, resumenContenedores } from "../types"

type propsType = {
    setShowData: (e: boolean) => void
    dataContenedores: contenedoresType[] | undefined
    resumen: resumenContenedores | undefined
}

type PredioDatosType = {
    [key: string]: {
        enf: string;
        predio: string;
        cont: contType,
        tipoFruta: string,
        calibres: calibreType
    }
};
type contType = {
    [key: string]: {
        numero: number,
        cajas: number,
        kilos: number
    }
}
type calibreType = {
    [key: string]: {
        cajas: number,
        kilos: number
    }
}

export default function DataHistorialContenedores({ resumen, setShowData }: propsType): JSX.Element {

    const tipoFrutas = useTipoFrutaStore(state => state.tiposFruta)
    const [fecha, setFecha] = useState<string>('');
    const [showCalibeCalidad, setShowCalibreCalidad] = useState<boolean>(false)
    const [verKilos, setVerKilos] = useState<boolean>(true)
    const [verCajas, setVerCajas] = useState<boolean>(true)
    const [verPorcentaje, setVerPorcentaje] = useState<boolean>(true)
    const [verPorcentajeCajas, setVerPorcentajeCajas] = useState<boolean>(true)
    const [numeroPallets, setNumeroPallets] = useState<boolean>(true)
    const [arrayCont, setArrayCont] = useState<string[]>([])
    // const [dataContenedores, setDataContenedores] = useState<contenedoresType[]>();

    const [dataResumen, setDataResumen] = useState<resultadoObtenerresumenContenedores>();
    const [showPredios, setShowPredios] = useState<boolean>(false)
    const [showCalidadEnCalibre, setShowCalidadEnCalibre] = useState<string>("")
    const [predios, setPredios] = useState<PredioDatosType>()
    const [filtro, setFiltro] = useState<string>('')

    useEffect(() => {
        if (resumen === undefined) return
        const dataClone = structuredClone(resumen?.resumen)
        if (fecha === '') {
            setDataResumen(dataClone);
        } else {
            if (resumen === undefined) return
            const dataFiltrada = fechasSeleccionarDia(dataClone, fecha)
            setDataResumen(dataFiltrada);
        }
    }, [fecha]);

    // const handleClickContenedores = (e: string): void => {
    //     if (arrayCont.includes(e)) {
    //         const newArr = arrayCont.filter(id => !(id === e));
    //         setArrayCont(newArr)
    //     } else {
    //         const newArr = [...arrayCont, e];
    //         setArrayCont(newArr)
    //     }
    // }
    // useEffect(() => {
    //     if (dataContenedores !== undefined) {

    //         const contenedoresFiltrados = dataContenedores
    //             .filter(item => arrayCont.includes(item._id as string))

    //     }
    // }, [arrayCont])

    // useEffect(() => {
    //     if (dataContenedores !== undefined) {

    //         const contenedoresFiltrados = dataContenedores
    //             .filter(item => arrayCont.includes(item._id as string))
    //         const data = obtenerResumenPredios(contenedoresFiltrados, false)
    //         setPredios(data);
    //     }
    // }, [props.dataContenedores, arrayCont])

    const mostrarDataResumenTotal = (data: resultadoObtenerresumenContenedores | undefined, tipoValor: string): string => {
        if (data === undefined) return ''
        let total = 0;
        for (const fruta in data) {
            total += data[fruta]?.[tipoValor] ?? 0;
        }
        return new Intl.NumberFormat('es-CO').format(total);
    };
    const mostrarDataResumenPorElementoCalidad = (fruta: string, ca: string, can: string, tipo: string): string => {
        if (dataResumen === undefined) return ''
        let total = 0;
        for (const fecha in dataResumen[fruta]) {
            if (fecha === 'totalCajas' || fecha === 'totalKilos') continue;
            total += dataResumen[fruta][fecha]?.[ca][can]?.[tipo] ?? 0;
        }
        return new Intl.NumberFormat('es-CO').format(total);
    }
    const mostrarCalidadPorCalibre = (fruta: string, calibre: string, calidad: string, tipo): number => {
        if (dataResumen === undefined) return 0
        let total = 0;
        for (const fecha in dataResumen[fruta]) {
            if (fecha === 'totalCajas' || fecha === 'totalKilos') continue;
            total += dataResumen[fruta][fecha]?.calibre?.[calibre]?.calidad?.[calidad]?.[tipo] ?? 0;
        }
        return total
    }


    // if (dataContenedores === undefined) {
    //     return (
    //         <div>
    //             <div className="historial-listasempaque-busqueda">
    //                 <button onClick={(): void => props.setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
    //             </div>
    //             <h2>Cargando contenedores...</h2>
    //         </div>
    //     )
    // }

    return (
        <div>
            <div className="historial-listasempaque-busqueda">
                <button onClick={(): void => setShowData(false)} className="defaulButtonAgree">Volver a buscar</button>
                <button
                    className="defaulButtonAgree"
                    onClick={(): void => setShowPredios(!showPredios)}>
                    {showPredios ? "Calidades/Calibre" : "Predios"}
                </button>
            </div>
            {showPredios ?
                <div className="proceso-listaempaque-resumen-container">
                    <div className="resumen-container-buttons-div">
                        <section >
                            <div>
                                <label>Filtro predio</label>
                                <input
                                    type="text"
                                    className="defaultSelect"
                                    onChange={(e): void => setFiltro(e.target.value)}
                                />
                            </div>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Cajas/Calibres</p>
                            <label className="switch">
                                <input type="checkbox" checked={showCalibeCalidad} onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                    </div>
                </div>
                :
                <div className="proceso-listaempaque-resumen-container">
                    <div className="resumen-container-buttons-div">
                        <section className="proceso-listaempaque-resumen-filtro-button-fecha">
                            <p>Fecha</p>
                            <label>
                                <input type="date" onChange={(e): void => setFecha(e.target.value)} />
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Calibre/Calidad</p>
                            <label className="switch">
                                <input type="checkbox" checked={showCalibeCalidad} onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Kilos</p>
                            <label className="switch">
                                <input type="checkbox" checked={verKilos} onChange={(e): void => setVerKilos(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>N° Cajas</p>
                            <label className="switch">
                                <input type="checkbox" checked={verCajas} onChange={(e): void => setVerCajas(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Kilos %</p>
                            <label className="switch">
                                <input type="checkbox" checked={verPorcentaje} onChange={(e): void => setVerPorcentaje(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>Cajas %</p>
                            <label className="switch">
                                <input type="checkbox" checked={verPorcentajeCajas} onChange={(e): void => setVerPorcentajeCajas(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>
                        <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                            <p>N° Pallets</p>
                            <label className="switch">
                                <input type="checkbox" checked={numeroPallets} onChange={(e): void => setNumeroPallets(e.target.checked)} />
                                <span className="slider round"></span>
                            </label>
                        </section>

                    </div>
                </div>
            }
            {/* <section className="historial-contenedores-mostrar-numero-contenedor">
                Contenedores:
                {dataContenedores.map(cont => (
                    <button
                        className={arrayCont.includes(cont._id as string)
                            ? 'historial-contenedores-contenedor-select' : ''}
                        key={cont._id}
                        onClick={(): void => handleClickContenedores(cont._id as string)}
                    >
                        {cont.numeroContenedor}
                    </button>
                ))}
            </section> */}
            <section className="historial-contenedores-mostrar-total-cajas-kilos-section">
                <h3>Total:</h3>
                {<h4>{mostrarDataResumenTotal(dataResumen, 'totalCajas')} cajas</h4>}
                {<h4>{mostrarDataResumenTotal(dataResumen, 'totalKilos')} Kilos</h4>}
            </section>
            {showPredios ?
                <section>
                    <div className="table-container">
                        <table className="table-main">
                            <thead>
                                <tr>
                                    <th>Predio</th>
                                    <th>Contenedores</th>
                                </tr>
                            </thead>
                            {predios && !showCalibeCalidad ?
                                <tbody>
                                    {predios && Object.values(predios).map((lote, index) => {
                                        if (
                                            lote.predio.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                            lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                        ) {
                                            return (
                                                <tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                                    <td>{lote.enf} - {lote.predio}</td>
                                                    <td>{Object.entries(lote.cont).map(([key, value]) => (
                                                        <div key={key}>
                                                            <div>{value.numero}: {value.cajas} Cajas - {value.kilos}Kg</div>
                                                            <div>{nombreTipoFruta2(lote.tipoFruta, tipoFrutas)}</div>
                                                        </div>
                                                    ))}</td>
                                                </tr>
                                            )
                                        } else {
                                            return
                                        }
                                    })}
                                </tbody>
                                :
                                <tbody>
                                    {predios && Object.values(predios).map((lote, index) => {
                                        if (
                                            lote.predio.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                            lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                        ) {
                                            return (<tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                                <td>{lote.enf} - {lote.predio}</td>
                                                <td>{Object.entries(lote.calibres).map(([key, value]) => (
                                                    <div key={key}>
                                                        <div>{key}: {value.cajas} Cajas - {value.kilos}Kg</div>
                                                        <div>{lote.tipoFruta}</div>
                                                    </div>
                                                ))}</td>
                                            </tr>)
                                        }
                                        else {
                                            return null
                                        }
                                    })}

                                </tbody>
                            }

                        </table>
                    </div>
                </section>
                :
                <section>
                    {dataResumen && Object.keys(dataResumen).map(tipoFruta => (
                        <div key={tipoFruta}>
                            <h2>{nombreTipoFruta2(tipoFruta, tipoFrutas)}</h2>
                            <hr />
                            <div className="table-container">

                                <table className="table-main" >
                                    <thead>
                                        <tr>
                                            <th>{showCalibeCalidad ? "Calidades" : "Calibres"}</th>
                                            {verKilos && <th>Kilos</th>}
                                            {verCajas && <th>Cajas</th>}
                                            {verPorcentaje && <th>% Kilos</th>}
                                            {verPorcentajeCajas && <th>% Cajas</th>}
                                            {numeroPallets && <th>N° Pallets</th>}
                                        </tr>
                                    </thead>
                                    {showCalibeCalidad ?
                                        <tbody>
                                            {resumen && resumen.totalCalidades.map((calidad, index) => (
                                                <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={calidad}>
                                                    <td>{tipoCalidad(calidad, tipoFrutas)}</td>
                                                    {verKilos &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calidad", calidad, "kilos")} Kg</td>}
                                                    {verCajas &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calidad", calidad, "cajas")}</td>}
                                                    {verPorcentaje &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calidad", calidad, "kilosP")} %</td>}
                                                    {verPorcentajeCajas &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calidad", calidad, "cajasP")} %</td>}
                                                    {numeroPallets &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calidad", calidad, "pallet")}</td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                        :
                                        <tbody>
                                            {resumen && resumen.totalCalibres.map((calibre, index) => (
                                                <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}
                                                    key={calibre}
                                                    onClick={(): void => {
                                                        if(showCalidadEnCalibre === `${tipoFruta}-${calibre}`){
                                                            setShowCalidadEnCalibre("")
                                                        } else {
                                                            setShowCalidadEnCalibre(`${tipoFruta}-${calibre}`)
                                                        }
                                                    }}>
                                                    <td>{calibre}</td>

                                                    {showCalidadEnCalibre === `${tipoFruta}-${calibre}` ?
                                                        <>
                                                            {verKilos && <td>
                                                                {resumen && resumen.totalCalidades.map((calidad) => (
                                                                    <div key={calidad + calibre + tipoFruta}>
                                                                        {tipoCalidad(calidad, tipoFrutas)}:{mostrarCalidadPorCalibre(tipoFruta, calibre, calidad, "kilos")} Kg
                                                                    </div>
                                                                ))}
                                                            </td>}
                                                            {verCajas && <td>
                                                                {resumen && resumen.totalCalidades.map((calidad) => (
                                                                    <div key={calidad + calibre + tipoFruta}>
                                                                        {tipoCalidad(calidad, tipoFrutas)}:{mostrarCalidadPorCalibre(tipoFruta, calibre, calidad, "cajas")}
                                                                    </div>
                                                                ))}
                                                            </td>}
                                                            {verPorcentaje &&  <td>
                                                                {resumen && resumen.totalCalidades.map((calidad) => (
                                                                    <div key={calidad + calibre + tipoFruta}>
                                                                        {tipoCalidad(calidad, tipoFrutas)}:{mostrarCalidadPorCalibre(tipoFruta, calibre, calidad, "kilosP")?.toFixed(2) ?? "N/A"} %
                                                                    </div>
                                                                ))}
                                                            </td>}
                                                            { verPorcentajeCajas && <td>
                                                                {resumen && resumen.totalCalidades.map((calidad) => (
                                                                    <div key={calidad + calibre + tipoFruta}>
                                                                        {tipoCalidad(calidad, tipoFrutas)}:{mostrarCalidadPorCalibre(tipoFruta, calibre, calidad, "cajasP")?.toFixed(2) ?? "N/A"} %
                                                                    </div>
                                                                ))}
                                                            </td>}

                                                        </>
                                                        :
                                                        <>
                                                            {verKilos &&
                                                                <td>{(mostrarDataResumenPorElementoCalidad(tipoFruta, "calibre", calibre, "kilos"))} Kg</td>}
                                                            {verCajas &&
                                                                <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calibre", calibre, "cajas")}</td>}
                                                            {verPorcentaje &&
                                                                <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calibre", calibre, "cajasP")} %</td>}
                                                            {verPorcentajeCajas &&
                                                                <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calibre", calibre, "cajasP")} %</td>}

                                                        </>
                                                    }
                                                    {numeroPallets &&
                                                        <td>{mostrarDataResumenPorElementoCalidad(tipoFruta, "calibre", calibre, "pallet")}</td>}
                                                </tr>
                                            ))}
                                        </tbody>}
                                </table>
                            </div>
                        </div>
                    ))}

                </section>
            }
        </div>
    )
}