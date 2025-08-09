/* eslint-disable prettier/prettier */

import { z } from "zod"

export const formInit = {
    acidez1: '',
    acidez2: '',
    acidez3: '',
    brix1: '',
    brix2: '',
    brix3: '',
    peso: '',
    zumo: '',
    semillas: 'false',
    calidad: ""
}

export type formType = {
    acidez1: string,
    acidez2: string,
    acidez3: string,
    brix1: string,
    brix2: string,
    brix3: string,
    peso: string,
    zumo: string,
    semillas: string,
    calidad: string
}


// Helper: string numérica (float) requerida
const numericString = z
    .string()
    .trim()
    .min(1, { message: 'Requerido' })
    .refine((v) => !Number.isNaN(Number(v)) && Number.isFinite(Number(v)), {
        message: 'Debe ser un número válido',
    })

// Variantes con reglas adicionales
const nonZeroNumericString = numericString.refine((v) => parseFloat(v) !== 0, {
    message: 'No puede ser 0',
})

const positiveNumericString = numericString.refine((v) => parseFloat(v) > 0, {
    message: 'Debe ser mayor que 0',
})

export const formSchema = z
    .object({
        acidez1: nonZeroNumericString,
        acidez2: nonZeroNumericString,
        acidez3: nonZeroNumericString,
        brix1: positiveNumericString,
        brix2: positiveNumericString,
        brix3: positiveNumericString,
        peso: numericString,
        zumo: numericString,
        calidad: z.string().trim().min(1, { message: 'Requerido' }),
        semillas: z.enum(['true', 'false']),
    })
    .superRefine((data, ctx) => {
        const peso = parseFloat(data.peso)
        const zumo = parseFloat(data.zumo)
        if (!Number.isNaN(peso) && !Number.isNaN(zumo) && zumo > peso) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['zumo'],
                message: 'Zumo no puede ser mayor que peso',
            })
        }
    })

