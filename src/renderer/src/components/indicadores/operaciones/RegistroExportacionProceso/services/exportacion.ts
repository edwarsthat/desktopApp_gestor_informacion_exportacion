/* eslint-disable prettier/prettier */

import { indicadoresType } from "@renderer/types/indicadoresType";

export const total_procesado = (registro: indicadoresType): number => {
    if (registro.kilos_vaciados && Object.keys(registro.kilos_vaciados).length > 0) {
        return Object.values(registro.kilos_vaciados).reduce((acc, kilos) => acc + kilos, 0);
    }
    return 0
}

export const total_exportacion = (registro: indicadoresType): number => {
    if (!registro.kilos_exportacion) return 0;

    return Object.values(registro.kilos_exportacion as Record<string, Record<string, Record<string, number | string>>>)
        .flatMap(tipoFruta =>
            Object.values(tipoFruta as Record<string, Record<string, number | string>>)
                .flatMap(calidad =>
                    Object.values(calidad as Record<string, number | string>)
                        .map(Number)
                )
        )
        .reduce((sum, kilos) => sum + (isNaN(kilos) ? 0 : kilos), 0);
};
