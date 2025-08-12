/* eslint-disable prettier/prettier */

import { z } from "zod"

export const formInit = {
    tipoFruta: '',
    frutaNacional: '',
    descarte: '',
    week: '',
    comentario: ''
}

export type formType = {
    tipoFruta: string
    frutaNacional: string
    descarte: string
    week: string
    comentario: string
    [key: string]: string 
}

// Validador para strings que representen números >= 0
const numericString = z.string().refine((value) => {
  if (value === "") return false
  const n = Number(value)
  return !Number.isNaN(n) && n >= 0
}, { message: "Debe ser un número mayor o igual a 0" })

export const formSchema = z.object({
  tipoFruta: z.string().trim().min(1, "Campo requerido"), // obligatorio no vacío
  frutaNacional: numericString, // string numérico >= 0
  descarte: numericString, // string numérico >= 0
  week: z.string().trim().min(1, "Campo requerido"), // obligatorio no vacío
  comentario: z.string(), // resto: solo string
}).catchall(numericString)