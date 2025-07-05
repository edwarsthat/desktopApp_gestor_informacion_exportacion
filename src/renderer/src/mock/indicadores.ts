/* eslint-disable prettier/prettier */
import { indicadoresType, kilosProcesadosSchema, KilosExportacionSchema } from "@renderer/types/indicadoresType";

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateKilosProcesadosSchema(): kilosProcesadosSchema {
    const frutas = ["Naranja", "Limon", "Mandarina", "Pomelo"];
    const obj: kilosProcesadosSchema = {};
    frutas.forEach(fruta => {
        obj[fruta] = randomInt(0, 10000);
    });
    return obj;
}

// La función corregida para generar la estructura anidada real:
function generateKilosExportacionSchema(): KilosExportacionSchema {
    const frutas = ["Naranja", "Limon"];
    const calidades = ["1", "2"];
    const calibres = ["80", "100", "120"];
    const obj: KilosExportacionSchema = {};

    frutas.forEach(fruta => {
        obj[fruta] = {};
        calidades.forEach(calidad => {
            obj[fruta][calidad] = {};
            calibres.forEach(calibre => {
                obj[fruta][calidad][calibre] = randomInt(0, 3000);
            });
        });
    });

    return obj;
}

/**
 * Genera un mock de un indicador de proceso según el schema dado.
 */
export function generateMockIndicadorProceso(overrides: Partial<indicadoresType> = {}): indicadoresType {
    return {
        _id: `mock_id_${randomInt(1000, 9999)}`,
        fecha_creacion: new Date().toISOString(),
        kilos_procesados: generateKilosProcesadosSchema(),
        kilos_vaciados: generateKilosProcesadosSchema(),
        kilos_exportacion: generateKilosExportacionSchema(),
        kilos_meta_hora: randomInt(100, 5000),
        duracion_turno_horas: randomFloat(4, 12, 1),
        ...overrides
    };
}
