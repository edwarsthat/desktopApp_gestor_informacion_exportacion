/* eslint-disable prettier/prettier */

import { format, parseISO, isValid } from "date-fns";
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

/**
 * Formatea una cadena de fecha a un formato especificado, convirtiendo a la zona horaria de Bogotá.
 * 
 * @param {string} fechaString - La cadena de fecha a formatear, en formato ISO 8601.
 * @param {boolean} [hora=false] - Bandera opcional para incluir la hora en la salida formateada.
 * @returns {string} La cadena de fecha formateada.
 */
export const formatearFecha = (fechaString: string, hora = false): string => {
    if (!fechaString) return 'Sin fecha';

    const zonaHoraria = 'America/Bogota';
    let fechaUTC;

    try {
        fechaUTC = parseISO(fechaString);
    } catch {
        return 'Fecha inválida';
    }

    // Verifica si la fecha es válida
    if (!isValid(fechaUTC)) return 'Fecha inválida';

    let fechaBogota;
    try {
        fechaBogota = toZonedTime(fechaUTC, zonaHoraria);
    } catch {
        return 'Fecha inválida';
    }

    try {
        if (hora) {
            return format(fechaBogota, 'dd/MM/yyyy HH:mm:ss', { locale: es });
        }
        return format(fechaBogota, 'dd/MM/yyyy', { locale: es });
    } catch {
        return 'Fecha inválida';
    }
};

export function formatearParaDatetimeLocal(fechaIsoUTC): string {
    const dateUtc = new Date(fechaIsoUTC);

    // Convertimos restando 5 horas (Colombia está en UTC-5)
    const colombiaTime = new Date(dateUtc.getTime() - (5 * 60 * 60 * 1000));

    const year = colombiaTime.getFullYear();
    const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
    const day = String(colombiaTime.getDate()).padStart(2, '0');
    const hours = String(colombiaTime.getHours()).padStart(2, '0');
    const minutes = String(colombiaTime.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}