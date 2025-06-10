/* eslint-disable prettier/prettier */

import { z } from "zod";

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema>

export const initForm = {
    temperatura: "",
    etileno: "",
    carbono: "",
    humedad: "",
}

export type formType = {
    temperatura: string;
    etileno: string;
    carbono: string;
    humedad: string;
}

export const formKeys = {
    temperatura: "Temperatura",
    etileno: "Etileno",
    carbono: "Dióxido de carbono",
    humedad: "Humedad",
}

export const formSchema = z.object({
    temperatura: z.string()
        .min(1, "Temperatura es requerida")
        .refine(val => /^-?\d+(\.\d+)?$/.test(val), {
            message: "Debe ser un número válido"
        })
        .refine(val => Math.abs(parseFloat(val)) <= 1_000_000, {
            message: "El número no debe superar el millón"
        }),

    etileno: z.string()
        .min(1, "Etileno es requerido")
        .refine(val => /^-?\d+(\.\d+)?$/.test(val), {
            message: "Debe ser un número válido"
        })
        .refine(val => Math.abs(parseFloat(val)) <= 1_000_000, {
            message: "El número no debe superar el millón"
        }),

    carbono: z.string()
        .min(1, "Dióxido es requerido")
        .refine(val => /^-?\d+(\.\d+)?$/.test(val), {
            message: "Debe ser un número válido"
        })
        .refine(val => Math.abs(parseFloat(val)) <= 1_000_000, {
            message: "El número no debe superar el millón"
        }),

    humedad: z.string()
        .min(1, "Humedad es requerida")
        .refine(val => /^-?\d+(\.\d+)?$/.test(val), {
            message: "Debe ser un número válido"
        })
        .refine(val => Math.abs(parseFloat(val)) <= 1_000_000, {
            message: "El número no debe superar el millón"
        }),
});
