/* eslint-disable prettier/prettier */

import { z } from "zod";

export const validateFrutapRocesadaHora = z.object({
    fechaInicio: z.string()
        .min(1, "Fecha de inicio es requerida")
        .refine((fecha) => {
            // Validar que sea una fecha válida
            const date = new Date(fecha);
            return !isNaN(date.getTime());
        }, "Fecha de inicio debe ser una fecha válida"),

    fechaFin: z.string()
        .refine((fecha) => {
            // Permitir cadena vacía
            if (fecha === "") return true;
            // Si no está vacía, debe ser una fecha válida
            const date = new Date(fecha);
            return !isNaN(date.getTime());
        }, "Fecha de fin debe ser una fecha válida o estar vacía")
}).refine((data) => {
    if (data.fechaFin === "") return true;

    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);

    // Setear hora mínima para inicio (00:00:00.000)
    fechaInicio.setHours(0, 0, 0, 0);

    // Setear hora máxima para fin (23:59:59.999)
    fechaFin.setHours(23, 59, 59, 999);

    return fechaFin > fechaInicio;
}, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"]
})
