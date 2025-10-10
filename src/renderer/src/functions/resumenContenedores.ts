/* eslint-disable prettier/prettier */

import { itemPalletType } from "@renderer/types/contenedores/itemsPallet";
import { proveedoresType } from "@renderer/types/proveedoresType";
import { resultadoObtenerresumenContenedores } from "@renderer/types/responses/resumenContenedores"
import { tiposFrutasType } from "@renderer/types/tiposFrutas";

// Claves (libres, pero te ayudan a documentar intención)
export type TipoFruta = string;   // "Limon" | "Naranja" | ...
export type Calibre = string;   // "110" | "150" | ...
export type Calidad = string;   // "A" | "B" | "EXPORT" | ...

// Métrica base por grupo (calibre/calidad)
export interface MetricItem {
    cajas: number;
    cajasP: number;  // porcentaje sobre total de la fruta
    kilos: number;
    kilosP: number;  // porcentaje sobre total de la fruta
    pallet: number;
}

// Secciones por fruta
export interface FrutaResumen {
    calibre: Record<Calibre, MetricItem>;
    calidad: Record<Calidad, MetricItem>;
    totalCajas: number;
    totalKilos: number;
}

// Objeto final que devuelve tu función
export type ResumenContenedores = Record<TipoFruta, FrutaResumen>;

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

export const obtenerResumenPredios = (items: itemPalletType[], soloHoy: boolean): PredioDatosType => {
    const predios = {}
    for (const item of items) {

        if (item.lote?._id) {
            if (soloHoy) {
                const hoy = new Date().getDate();
                const fechaItem = new Date(item.fecha).getDate();
                if (hoy === fechaItem) {
                    if (!predios[item.lote._id]) {
                        predios[item.lote._id] = {
                            enf: item.lote.enf,
                            predio: item.lote.predio,
                            tipoFruta: item.tipoFruta
                        }
                        predios[item.lote._id].cont = {}
                        predios[item.lote._id].calibres = {}
                    }
                    if (!predios[item.lote._id].cont[item.contenedor._id]) {
                        predios[item.lote._id].cont[item.contenedor._id] = {
                            numero: item.contenedor.numeroContenedor,
                            kilos: 0,
                            cajas: 0
                        }
                    }
                    if (!predios[item.lote._id].calibres[item.calibre]) {
                        predios[item.lote._id].calibres[item.calibre] = {
                            kilos: 0,
                            cajas: 0
                        }
                    }
                    if (item.tipoCaja !== null || item.cajas !== null) {
                        predios[item.lote._id].cont[item.contenedor._id].cajas += item.cajas
                        predios[item.lote._id].calibres[item.calibre].cajas += item.cajas

                        const mult = item.tipoCaja.split('-')[1].replace(",", ".")
                        const kilos = item.cajas * Number(mult)

                        predios[item.lote._id].cont[item.contenedor._id].kilos += kilos
                        predios[item.lote._id].calibres[item.calibre].kilos += kilos
                    }

                }

            } else {
                if (!Object.prototype.hasOwnProperty.call(predios, item.lote._id)) {
                    predios[item.lote._id] = {
                        enf: item.lote.enf,
                        predio: item.lote.predio,
                        tipoFruta: item.tipoFruta
                    }
                    predios[item.lote._id].cont = {}
                    predios[item.lote._id].calibres = {}

                }
                if (!predios[item.lote._id].cont[item.contenedor._id]) {
                    predios[item.lote._id].cont[item.contenedor._id] = {
                        numero: item.contenedor.numeroContenedor,
                        kilos: 0,
                        cajas: 0
                    }
                }
                if (!Object.prototype.hasOwnProperty.call(predios[item.lote._id].calibres, item.calibre as string)) {
                    predios[item.lote._id].calibres[item.calibre] = {
                        kilos: 0,
                        cajas: 0
                    }
                }
                if (item.tipoCaja !== null) {
                    predios[item.lote._id].cont[item.contenedor._id].cajas += item.cajas
                    predios[item.lote._id].calibres[item.calibre].cajas += item.cajas

                    const mult = item.tipoCaja.split('-')[1].replace(",", ".")
                    const kilos = item.cajas * Number(mult)
                    predios[item.lote._id].cont[item.contenedor._id].kilos += kilos
                    predios[item.lote._id].calibres[item.calibre].kilos += kilos

                }
            }
        }

    }
    console.log(predios)
    return predios
}
export const obtenerResumen = (items: itemPalletType[], soloHoy = '')
    : ResumenContenedores | null => {

    if (!Array.isArray(items) || items.length === 0) {
        return null
    }
    const resumen: ResumenContenedores = {}

    for (const item of items) {
        const calibreSet = new Set()
        const calidadSet = new Set()
        const tipoFrutaSet = new Set()

        const { tipoFruta, calibre, calidad, cajas } = item
        //se crea el elemento en el objeto
        if (!resumen[tipoFruta._id]) {
            resumen[tipoFruta._id] = {
                calibre: {},
                calidad: {},
                totalCajas: 0,
                totalKilos: 0
            }
        }

        if (!resumen[tipoFruta._id].calibre[calibre]) {
            resumen[tipoFruta._id].calibre[calibre] = {
                cajas: 0,
                cajasP: 0,
                kilos: 0,
                kilosP: 0,
                pallet: 0
            }
        }
        if (!Object.prototype.hasOwnProperty.call(resumen[tipoFruta._id].calidad, calidad._id)) {
            resumen[tipoFruta._id].calidad[calidad._id] = {
                cajas: 0,
                cajasP: 0,
                kilos: 0,
                kilosP: 0,
                pallet: 0
            }
        }

        if (soloHoy) {

            const [year, month, day] = soloHoy.split('-');
            const diaItem = new Date(item.fecha).getDate();
            const mesItem = new Date(item.fecha).getMonth();
            const annoItem = new Date(item.fecha).getFullYear();
            if (Number(day) === diaItem &&
                Number(month) === mesItem + 1 &&
                Number(year) === annoItem) {
                //lo kilos total
                const kilos = item.kilos
                //if si mira si solo se requieren los datos de hoy
                resumen[tipoFruta._id].calibre[calibre].kilos += kilos
                resumen[tipoFruta._id].calibre[calibre].cajas += cajas

                resumen[tipoFruta._id].calidad[calidad._id].kilos += kilos
                resumen[tipoFruta._id].calidad[calidad._id].cajas += cajas

                resumen[tipoFruta._id].totalCajas += cajas
                resumen[tipoFruta._id].totalKilos += kilos
            }

        } else {
            //lo kilos total
            const kilos = item.kilos;
            //if si mira si solo se requieren los datos de hoy
            resumen[tipoFruta._id].calibre[calibre].kilos += kilos
            resumen[tipoFruta._id].calibre[calibre].cajas += cajas

            resumen[tipoFruta._id].calidad[calidad._id].kilos += kilos
            resumen[tipoFruta._id].calidad[calidad._id].cajas += cajas

            resumen[tipoFruta._id].totalCajas += cajas
            resumen[tipoFruta._id].totalKilos += kilos
        }
        calibreSet.add(calibre)
        calidadSet.add(calidad)
        tipoFrutaSet.add(tipoFruta._id)
        const arrTipoFruta = [...tipoFrutaSet]

        arrTipoFruta.forEach(fruta => {

            const arrCalibre = [...calibreSet]
            arrCalibre.forEach(cal => {
                if (resumen[fruta as string].calibre[cal as string]) {
                    resumen[fruta as string].calibre[cal as string].pallet += 1

                }
            })
            const arrCalidad = [...calidadSet]
            arrCalidad.forEach(cal => {
                if (resumen[fruta as string].calidad[cal as string]) {
                    resumen[fruta as string].calidad[cal as string].pallet += 1

                }
            })

        })
    }

    Object.keys(resumen).forEach(tipoFruta => {
        const itemFruta = resumen[tipoFruta]
        const kilosTotal = itemFruta.totalKilos
        const cajasTotal = itemFruta.totalCajas
        Object.keys(itemFruta).forEach(tipo => {
            const ca = itemFruta[tipo]
            Object.keys(ca).forEach(key => {
                const item = ca[key]

                item.cajasP = (item.cajas * 100) / cajasTotal
                item.kilosP = (item.kilos * 100) / kilosTotal
            })
        })
    })

    return resumen
}
export const fechasSeleccionarDia = (data: resultadoObtenerresumenContenedores, fecha: string): resultadoObtenerresumenContenedores => {
    const tipoFrutaKeys = Object.keys(data)
    for (let i = 0; i < tipoFrutaKeys.length; i++) {
        const fechasKeys = Object.keys(data[tipoFrutaKeys[i]])
        for (let j = 0; j < fechasKeys.length; j++) {
            if (fechasKeys[j] === 'totalCajas' || fechasKeys[j] === 'totalKilos') continue;
            if (fechasKeys[j] !== fecha) {
                delete data[tipoFrutaKeys[i]][fechasKeys[j]]
            }
        }
    }
    return data
}