/* eslint-disable prettier/prettier */
import { z } from "zod";

export type formTypeOutput = z.infer<typeof formSchema>
export type formTypeInput = z.input<typeof formSchema>

export const initialForm = {
    fechaCreacion: "",
    fechaInicio: "",
    fechaInicioReal: "",
    fechaEstimadaCargue: "",
    fechaFinalizado: "",
    fechaSalida: "",
    tipoFruta: [""],
    tipoCaja: [""],
    calidad: [""],
    calibres: [""],
    cliente: "",
    observaciones: "",
    sombra: "",
    defecto: "",
    mancha: "",
    verdeManzana: "",
}

export const formSchema = z.object({
    fechaCreacion: z.string().min(1, "La fecha de creación es obligatoria"),
    fechaInicio: z.string().optional(),
    fechaInicioReal: z.string().optional(),
    fechaEstimadaCargue: z.string().optional(),
    fechaFinalizado: z.string().optional(),
    fechaSalida: z.string().optional(),
    tipoFruta: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de fruta"),
    tipoCaja: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de caja"),
    calidad: z.array(z.string()).min(1, "Debe seleccionar al menos una calidad"),
    calibres: z.array(z.string()).min(1, "Debe seleccionar al menos un calibre"),
    cliente: z.string().min(1, "El cliente es obligatorio"),
    observaciones: z.string().optional(),
    sombra: z.string().optional(),
    defecto: z.string().optional(),
    mancha: z.string().optional(),
    verdeManzana: z.string().optional(),
})

export type formType = typeof initialForm;

export const formLabels = {
    fechaCreacion: "Fecha de creación",
    fechaInicio: "Fecha de inicio de proceso",
    fechaInicioReal: "Fecha de inicio real",
    fechaEstimadaCargue: "Fecha estimada de cargue",
    fechaFinalizado: "Fecha de finalización",
    fechaSalida: "Fecha de salida",
    cliente: "Cliente",
    tipoFruta: "Tipo de fruta",
    tipoCaja: "Tipo de caja",
    calidad: "Calidad",
    calibres: "Calibres",
    observaciones: "Observaciones",
    sombra: "Sombra",
    defecto: "Defecto",
    mancha: "Mancha",
    verdeManzana: "Verde manzana",
}

