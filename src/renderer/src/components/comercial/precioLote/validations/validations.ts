/* eslint-disable prettier/prettier */

import { z } from "zod"

export const formInit = {
    enf: '',
    tipoFruta: '',
    frutaNacional: '',
    descarte: '',
    comentario: ''
}

export type formType = {
    enf: string
    tipoFruta: string
    frutaNacional: string
    descarte: string
    comentario: string
    [key: string]: string
}

export const formLabels = {
    enf: 'EF1-',
    tipoFruta: 'Tipo de Fruta',
    frutaNacional: 'Fruta Nacional',
    descarte: 'Descarte',
    comentario: 'Observaciones'
}

// Validador para strings que representen números >= 0
const numericString = z.string().refine((value) => {
    if (value === "") return false
    const n = Number(value)
    return !Number.isNaN(n) && n >= 0
}, { message: "Debe ser un número mayor o igual a 0" })

export const formSchema = z.object({
    enf: z.string().trim().min(1, "Campo requerido"), // obligatorio no vacío
    tipoFruta: z.string().trim().min(1, "Campo requerido"), // obligatorio no vacío
    frutaNacional: numericString, // string numérico >= 0
    descarte: numericString, // string numérico >= 0
    comentario: z.string(), // resto: solo string
}).catchall(numericString)

