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