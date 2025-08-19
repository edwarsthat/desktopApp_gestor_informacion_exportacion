/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType";

export function total_data(lotes: lotesType[], key): number {
    if (!lotes || !key) return 0
    if (!Array.isArray(lotes) || !key) return 0;
    if (lotes.length <= 0) return 0;

    let sumatoria = 0;

    const lotesL = lotes.length
    for (let i = 0; i <= lotesL; i++) {
        if (!lotes[i]) {
            continue;
        }
        if (key === "deshidratacionKilos") {

            const deshidratacion = lotes[i].deshidratacion / 100
            const kilos = lotes[i].kilos * deshidratacion

            if (!isNaN(kilos)) {
                sumatoria += kilos

            } else {
                sumatoria += 0
            }

        }
        else if (!Object.prototype.hasOwnProperty.call(lotes[i], key)) {
            sumatoria += 0
        } else {

            const item = lotes[i][key]

            if (key === "desverdizado") {
                if (typeof item.kilosIngreso === 'number') {
                    sumatoria += item.kilosIngreso
                } else {
                    sumatoria += 0
                }

            } else {
                if (typeof item === 'number') {
                    sumatoria += item
                } else {
                    sumatoria += 0
                }
            }
        }
    }

    return sumatoria
}

export function total_descarte(lotes: lotesType[], descarte: string): number {

    if (!lotes || !descarte) return 0
    if (!Array.isArray(lotes) || !descarte) return 0;
    if (lotes.length <= 0) return 0;

    let sumatoriaLotes = 0
    let sumatoriaLote = 0

    const lotesL = lotes.length

    for (let i = 0; i <= lotesL; i++) {
        if (!lotes[i]) {
            continue;
        }
        if (!Object.prototype.hasOwnProperty.call(lotes[i], descarte)) {
            sumatoriaLotes += 0
        } else {
            const desc = lotes[i][descarte]
            const decKeys = Object.keys(desc)
            const descL = decKeys.length


            for (let j = 0; j <= descL; j++) {
                const tipo = decKeys[j]
                if (typeof desc[tipo] === 'number') {
                    sumatoriaLote += desc[tipo]
                } else {
                    sumatoriaLote += 0
                }
            }
            sumatoriaLotes += sumatoriaLote
        }
        sumatoriaLote = 0
    }


    return sumatoriaLotes
}


export function promedio_data(lotes: lotesType[], key: string): number {

    if (!lotes || !key) return 0
    if (!Array.isArray(lotes) || !key) return 0;
    if (lotes.length <= 0) return 0;

    let total

    if (key === "descarteLavado" || key === 'descarteEncerado') {
        total = total_descarte(lotes, key)
    } 
    else {
        total = total_data(lotes, key)
    }
    const promedio = total / lotes.length

    return promedio
}

