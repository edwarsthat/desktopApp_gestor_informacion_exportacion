/* eslint-disable prettier/prettier */

import { z } from "zod";

export const initialValues = {
    descarteGeneral: "",
    pareja: "",
    balin: "",
    enf: "",
    fecha_ingreso_inventario: "",
    numeroPrecintos: "",
    numeroRemision: "",
    observaciones: "",
    placa: "",
    predio: "",
    tipoFruta: "",
    canastillasPropias: "",
    canastillasPrestadas: "",
    canastillasVaciasPropias: "",
    canastillasVaciasPrestadas: "",
}

export type formType = typeof initialValues;

export const formKeys = {
    descarteGeneral: "Manchada (Kg)",
    pareja: "Pareja (Kg)",
    balin: "Balin (Kg)",
    canastillasPropias: "Canastillas Propias",
    canastillasPrestadas: "Canastillas Prestadas",
    canastillasVaciasPropias: "Canastillas Vacías Propias",
    canastillasVaciasPrestadas: "Canastillas Vacías Prestadas",
    fecha_ingreso_inventario: "Fecha de Ingreso al Inventario",
    numeroPrecintos: "Número de Precintos",
    numeroRemision: "Número de Remisión",
    placa: "Placa",
    observaciones: "Observaciones",
}

export const formSchema = z.object({
    predio: z.string().min(1, "El predio es obligatorio"),
    tipoFruta: z.string().min(1, "El tipo de fruta es obligatorio"),
    descarteGeneral: z
        .string()
        .optional()
        .transform(val => val === undefined || val === "" ? 0 : Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    pareja: z
        .string()
        .optional()
        .transform(val => val === undefined || val === "" ? 0 : Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    balin: z
        .string()
        .optional()
        .transform(val => val === undefined || val === "" ? 0 : Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    canastillasPropias: z
        .string()
        .optional()
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    canastillasPrestadas: z
        .string()
        .optional()
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    canastillasVaciasPropias: z
        .string()
        .optional()
        .transform(val => val === undefined || val === "" ? 0 : Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    canastillasVaciasPrestadas: z
        .string()
        .optional()
        .transform(val => val === undefined || val === "" ? 0 : Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),
    fecha_ingreso_inventario: z.string()
        .min(1, "La fecha de ingreso es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),
    placa: z
        .string()
        .min(1, "La placa es obligatoria")
        .regex(/^[A-Z]{3}\d{3}$/, "La placa debe tener 3 letras seguidas de 3 números (ej. ABC123)")
        .transform(val => val.toUpperCase())

});

export const validateNumeroKilosCanastillas = (formState: formType): void => {
    const total = Number(formState.descarteGeneral || 0) + Number(formState.balin || 0) + Number(formState.pareja || 0);
    if(total <= 0) {
        throw new Error("Debe ingresar al menos un valor en Descarte General, Pareja o Balin");
    }
    const totalCanastillas =
        Number(formState.canastillasPropias || 0) + Number(formState.canastillasPrestadas || 0) +
        Number(formState.canastillasVaciasPropias || 0) + Number(formState.canastillasVaciasPrestadas || 0);
    if (totalCanastillas <= 0) {
        throw new Error("Debe ingresar al menos una canastilla (propia, prestada, vacía o llena)");
    }
}