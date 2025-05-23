/* eslint-disable prettier/prettier */
import { z } from "zod"

export type FormCanastillasType = {
    accion: string;
    canastillas: string;
    canastillasPrestadas: string;
    destino: string;
    origen: string;
    fecha: string;
    observaciones: string;
    remitente: string;
    destinatario: string;
};

export const initialFormCanastillasValues: FormCanastillasType = {
    accion: '',
    canastillas: "",
    canastillasPrestadas: "",
    destino: '',
    origen: '',
    fecha: '',
    observaciones: '',
    remitente: '',
    destinatario: '',
};
const ACCIONES_VALIDAS = ["ingreso", "salida", "traslado", "retiro", "cancelado"];

export const formSchema = z.object({
    destino: z.string().min(1, "El destino debe ser obligatorio"),
    origen: z.string().min(1, "El origen debe ser obligatorio"),
    observaciones: z.string().optional(),
    fecha: z.string()
        .min(1, "La fecha es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),
    canastillas: z
        .string()
        .min(1, "Campo obligatorio")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    canastillasPrestadas: z
        .string()
        .min(1, "Campo obligatorio")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    accion: z.string()
        .transform(accion => accion.trim().toLowerCase())
        .refine(
            accion => ACCIONES_VALIDAS.includes(accion),
            accion => ({
                message: `La acción '${accion}' no es válida. Usa: ${ACCIONES_VALIDAS.join(", ")}`
            })
        ),
    remitente: z.string().min(1, "El origen debe ser obligatorio"),
    destinatario: z.string().min(1, "El origen debe ser obligatorio"),
});

export const modificarInventarioSchema = z.object({
    action: z.string().min(1, "El action es obligatorio"),
    canastillas: z.number({ invalid_type_error: "Las canastillas deben ser un número" })
        .int("Las canastillas deben ser un número entero")
        .positive("Las canastillas deben ser mayores a cero")
        .optional(),
    canastillasPrestadas: z.number({ invalid_type_error: "Las canastillas deben ser un número" })
        .int("Las canastillas deben ser un número entero")
        .positive("Las canastillas deben ser mayores a cero")
        .optional(),
})