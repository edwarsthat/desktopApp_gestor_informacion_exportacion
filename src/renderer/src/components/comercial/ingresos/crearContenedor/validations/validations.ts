/* eslint-disable prettier/prettier */

import { z } from "zod";

export type FormStateType = Record<string, string | number | string[]>;

export const initForm: FormStateType = {
    cliente: '',
    numeroContenedor: '',
    tipoFruta: [],
    fechaInicioProceso: "",
    fechaEstimadaCargue: "",
    calidad: [],
    calibres: [],
    tipoCaja: [],
    sombra: '',
    defecto: '',
    mancha: '',
    verdeManzana: '',
    cajasTotal: '',
    rtoEstimado: '',
    observaciones:''
};


export const schemaForm = z.object({
    cliente: z.string().min(1, "El cliente es obligatorio"),
    numeroContenedor: z.string().min(1, "El número de contenedor es obligatorio"),
    tipoFruta: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de fruta"),
    fechaInicioProceso: z.string().min(1, "La fecha de inicio de proceso es obligatoria"),
    fechaEstimadaCargue: z.string().min(1, "La fecha estimada de cargue es obligatoria"),
    calidad: z.array(z.string()).min(1, "Debe seleccionar al menos una opción de calidad"),
    calibres: z.array(z.string()).min(1, "Debe seleccionar al menos un calibre"),
    tipoCaja: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de caja"),
    sombra: z.string().optional(),
    defecto: z.string().optional(),
    mancha: z.string().optional(),
    verdeManzana: z.string().optional(),
    cajasTotal: z.string().min(1, "El total de cajas es obligatorio"),
    rtoEstimado: z.string().optional(),
    observaciones: z.string().min(1, "Las observaciones son obligatorias")
})

export const formLabels = {
    cliente: "Cliente",
    numeroContenedor: "Número de Contenedor",
    tipoFruta: "Tipo de Fruta",
    fechaInicioProceso: "Fecha Inicio Proceso",
    fechaEstimadaCargue: "Fecha Estimada Cargue",
    calidad: "Calidad",
    calibres: "Calibres",
    tipoCaja: "Tipo de Caja",
    sombra: "Sombra",
    defecto: "Defecto",
    mancha: "Mancha",
    verdeManzana: "Verde Manzana",
    cajasTotal: "Cajas Total",
    rtoEstimado: "RTO",
    observaciones: "Observaciones"
}