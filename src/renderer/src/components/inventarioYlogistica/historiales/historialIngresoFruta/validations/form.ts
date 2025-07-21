/* eslint-disable prettier/prettier */

import { z } from "zod"

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema> // lo que viene del formulario

export const formInit = {
    enf: '',
    predio: '',
    canastillas: '',
    kilos: '',
    tipoFruta: '',
    observaciones: '',
    placa: '',
    fecha_ingreso_inventario: '',
    GGN: "false",
}

export type formInitType = {
    enf: string,
    predio: string,
    canastillas: string,
    kilos: string,
    tipoFruta: string,
    observaciones: string,
    placa: string,
    fecha_ingreso_inventario: string,
    GGN: string,
}

export const formSchema = z.object({
    enf: z.string().min(1, "El codigo del lote no puede ir vacio"),
    predio: z.string().min(1, "Debe seleccionar un predio"),
    canastillas: z.string({ required_error: "Campo obligatorio" })
        .min(1, "Debe ingresar un número")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    kilos: z
        .string({ required_error: "Los kilos son obligatorios" })
        .min(1, "Los kilos son obligatorios")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Los kilos deben ser un número válido" })
        .refine(val => val > 0, { message: "Los kilos deben ser mayores a 0" }),

    tipoFruta: z.string().min(1, "Se debe seleccionar un tipo de fruta"),
    observaciones: z.string().optional(),
    placa: z.string().min(1, "La placa es obligatoria"),
    fecha_ingreso_inventario: z.string()
        .min(1, "La fecha estimada de llegada es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),
    GGN: z.string().min(1, "El GGN es obligatorio").transform(val => val === "true"),
})

export const formInitEF8 = {
    enf: '',
    predio: '',
    canastillas: '',
    canastillasPrestadas: '',
    balin: '',
    pareja: '',
    descarteGeneral: '',
    tipoFruta: '',
    observaciones: '',
    placa: '',
    fecha_ingreso_inventario: '',
}

export type formTypeEF8 = typeof formInitEF8;

export const formLabelsEF8 = {
    enf: "Código del lote",
    predio: "Nombre del predio",
    canastillas: "Canastillas",
    canastillasPrestadas: "Canastillas Prestadas",
    balin: "Balin",
    pareja: "Pareja",
    descarteGeneral: "Manchada",
    tipoFruta: "Tipo de fruta",
    observaciones: "Observaciones",
    placa: "Placa",
    fecha_ingreso_inventario: "Fecha de ingreso",
}

export const formSchemaEF8 = z.object({
    enf: z.string().min(1, "El codigo del lote no puede ir vacio"),
    predio: z.string().min(1, "Debe seleccionar un predio"),
    canastillas: z
        .string()
        .optional()
        .transform(val => val === undefined ? undefined : Number(val))
        .refine(val => val === undefined || !isNaN(val), { message: "Los kilos deben ser un número válido" }),
        
    canastillasPrestadas: z
        .string()
        .optional()
        .transform(val => val === undefined ? undefined : Number(val))
        .refine(val => val === undefined || !isNaN(val), { message: "Los kilos deben ser un número válido" }),
    balin: z
        .string()
        .optional()
        .transform(val => val === undefined ? undefined : Number(val))
        .refine(val => val === undefined || !isNaN(val), { message: "Los kilos deben ser un número válido" }),
    pareja: z
        .string()
        .optional()
        .transform(val => val === undefined ? undefined : Number(val))
        .refine(val => val === undefined || !isNaN(val), { message: "Los kilos deben ser un número válido" }),
    descarteGeneral: z
        .string()
        .optional()
        .transform(val => val === undefined ? undefined : Number(val))
        .refine(val => val === undefined || !isNaN(val), { message: "Los kilos deben ser un número válido" }),

    tipoFruta: z.string().min(1, "Se debe seleccionar un tipo de fruta"),
    observaciones: z.string().optional(),
    placa: z.string().min(1, "La placa es obligatoria"),
    fecha_ingreso_inventario: z.string()
        .min(1, "La fecha estimada de llegada es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),
})