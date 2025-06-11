/* eslint-disable prettier/prettier */

import { z } from "zod";

export const initFormMover = {
    destino: "",
    cantidad: "",
}

export type formMoverType = {
    destino: string,
    cantidad: string,
}

export const formMoverKeys = {
    destino: "Destino",
    cantidad: "Canastillas",
}

export const formSchemaMover = z.object({
    destino: z.string()
        .min(1, "Destino es requerido")
        .refine(val => /^[a-zA-Z0-9\s]+$/.test(val), {
            message: "Solo se permiten letras y números"
        }),
    
    cantidad: z.string()
        .min(1, "Cantidad es requerida")
        .refine(val => /^-?\d+(\.\d+)?$/.test(val), {
            message: "Debe ser un número válido"
        })
        .refine(val => Math.abs(parseFloat(val)) <= 1_000_000, {
            message: "El número no debe superar el millón"
        }),
})