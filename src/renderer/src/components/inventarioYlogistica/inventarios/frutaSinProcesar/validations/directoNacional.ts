/* eslint-disable prettier/prettier */
import { z } from "zod";

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema>

export const initialForm = {
    cliente: "",
    canastillas: "",
    placa: "",
    nombreConductor: "",
    telefono: "",
    cedula: "",
    remision: "",
}

export const formSchema = z.object({
    canastillas: z.coerce.number({
        invalid_type_error: "Debe ser un número",
    }).int("No se permiten decimales").min(1, "Debe ser mayor o igual a 1"),
    cliente: z.string().min(1, "El cliente es obligatorio"),
    placa: z.string().min(1, "La placa es obligatoria"),
    nombreConductor: z.string().min(1, "El nombre del conductor es obligatorio"),
    telefono: z.string().optional(),
    cedula: z.string().optional(),
    remision: z.string().min(1, "La remisión es obligatoria"),
})

export type formType = {
    canastillas: string;
    cliente: string;
    placa: string;
    nombreConductor: string;
    telefono?: string;
    cedula?: string;
    remision: string;
}

export const labelsForm = {
    canastillas: "Canastillas",
    cliente: "Cliente",
    placa: "Placa",
    nombreConductor: "Nombre del Conductor",
    telefono: "Teléfono",
    cedula: "Cédula",
    remision: "Remisión",
}