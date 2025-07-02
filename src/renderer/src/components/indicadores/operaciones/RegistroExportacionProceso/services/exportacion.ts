/* eslint-disable prettier/prettier */

import { indicadoresType } from "@renderer/types/indicadoresType";

export const total_procesado = (registro: indicadoresType): number => {
    if (registro.kilos_vaciados && Object.keys(registro.kilos_vaciados).length > 0) {
        return Object.values(registro.kilos_vaciados).reduce((acc, kilos) => acc + kilos, 0);
    }
    return 0
}

export const total_exportacion = (registro: indicadoresType): number => {
    if (registro.kilos_exportacion && Object.keys(registro.kilos_exportacion).length > 0) {
        const result = 0
        for (const key in registro.kilos_exportacion) {
            if (Object.prototype.hasOwnProperty.call(registro.kilos_exportacion, key)) {
                for (const key2 in registro.kilos_exportacion[key]) {
                    if (Object.prototype.hasOwnProperty.call(registro.kilos_exportacion[key], key2)) {
                        for (const key3 in registro.kilos_exportacion[key][key2]) {
                            if (Object.prototype.hasOwnProperty.call(registro.kilos_exportacion[key][key2], key3)) {
                                const kilos = registro.kilos_exportacion[key][key2][key3];
                                if (kilos) {
                                    return result + Number(kilos);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return 0
}