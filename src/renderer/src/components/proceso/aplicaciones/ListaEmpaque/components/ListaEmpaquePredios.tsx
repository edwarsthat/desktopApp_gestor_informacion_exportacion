/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import { obtenerResumenPredios } from "@renderer/functions/resumenContenedores";
import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { tiposFrutasType } from "@renderer/types/tiposFrutas";


type PredioDatosType = {
    [key: string]: {
        enf: string;
        predio: proveedoresType;
        cont: contType,
        tipoFruta: tiposFrutasType,
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

type propsType = {
    pallets: itemPalletType[]
}

export default function ListaEmpaquePredios({ pallets }: propsType): JSX.Element {
    const [soloHoy, setSoloHoy] = useState<boolean>(false)
    const [predios, setPredios] = useState<PredioDatosType>()
    const [filtro, setFiltro] = useState<string>('')
    const [showCalibeCalidad, setShowCalibreCalidad] = useState<boolean>(false)

    useEffect(() => {
        const data = obtenerResumenPredios(pallets, soloHoy)
        setPredios(data);
    }, [soloHoy, pallets])

    if (predios === undefined) {
        return (
            <div>Cargando datos...</div>
        )
    }
    return (
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
                    <p>Solo Hoy</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setSoloHoy(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
                <section className="proceso-listaempaque-resumen-filtro-button-hoy">
                    <p>Cajas/Calibre</p>
                    <label className="switch">
                        <input type="checkbox" onChange={(e): void => setShowCalibreCalidad(e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </section>
            </div>
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
                                        lote.predio.PREDIO.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                        lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                    ) {
                                        return (
                                            <tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                                <td>{lote.enf} - {lote.predio.PREDIO}</td>
                                                <td>{Object.entries(lote.cont).map(([key, value]) => (
                                                    <div key={key}>
                                                        <div>{value.numero}: {value.cajas} Cajas - {value.kilos}Kg</div>
                                                        <div>{lote.tipoFruta.tipoFruta}</div>
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
                                        lote.predio.PREDIO.toLowerCase().startsWith(filtro.toLowerCase()) ||
                                        lote.enf.toLocaleLowerCase().startsWith(filtro.toLocaleLowerCase())
                                    ) {
                                        return (<tr key={lote.enf} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                            <td>{lote.enf} - {lote.predio.PREDIO}</td>
                                            <td>{Object.entries(lote.calibres).map(([key, value]) => (
                                                <div key={key}>
                                                    <div>{key}: {value.cajas} Cajas - {value.kilos}Kg</div>
                                                    <div>{lote.tipoFruta.tipoFruta}</div>
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
        </div>
    )
}
