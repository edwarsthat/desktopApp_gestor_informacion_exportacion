/* eslint-disable prettier/prettier */

import { z } from "zod";

export const formInit = {
    cliente:"",
    ubicacion:"",
    canastillas: "",
}

export type FormType = typeof formInit;

export const labelsForm = {
    cliente: "Cliente",
    ubicacion: "Ubicación",
    canastillas: "Canastillas",
}

export const formSchema = z.object({
    cliente: z.string().min(1, { message: "El cliente es requerido" }),
    ubicacion: z.string().min(1, { message: "La ubicación es requerida" }),
    canastillas: z.string().min(1, { message: "Las canastillas son requeridas" }),
});
