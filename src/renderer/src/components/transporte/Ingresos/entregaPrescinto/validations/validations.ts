/* eslint-disable prettier/prettier */

import { z } from "zod";

export const initForm = {
    _id: "",
    entrega: "",
    recibe: "",
    fechaEntrega: "",
    observaciones: "",
}

export type formType = {
    _id: string;
    entrega: string;
    recibe: string;
    fechaEntrega: string;
    observaciones: string;
}

export const formKeys = {
    entrega: "Entrega",
    recibe: "Recibe",
    fechaEntrega: "Fecha de Entrega",
    observaciones: "Observaciones",
}

export const formSchema = z.object({
    _id: z.string().min(1, "El número de contenedor es obligatorio"),
    entrega: z.string().min(1, "El nombre de quien entrega es obligatorio"),
    recibe: z.string().min(1, "El nombre de quien recibe es obligatorio"),
    fechaEntrega: z.string()
        .min(1, "La fecha de entrega es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),
    observaciones: z.string().optional(),
})