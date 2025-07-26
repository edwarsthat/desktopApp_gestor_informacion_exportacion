/* eslint-disable prettier/prettier */

import { z } from "zod";

export const formInit = {
    operario: "",
    tipoFruta: "",
    unidades: "",
    defectos: "",
    calibre: ""
}

export type FormType = typeof formInit;

export const formKeyValue = {
    operario: "Operario",
    tipoFruta: "Tipo de fruta",
    unidades: "Unidades Revisadas",
    defectos: "Defectos Encontrados",
    calibre: "Calibre"
}

export const formSchema = z.object({
    operario: z.string().min(1, "Operario es requerido"),
    tipoFruta: z.string().min(1, "Tipo de fruta es requerido"),
    unidades: z.string()
        .min(1, "Unidades es requerido")
        .refine((val) => !isNaN(Number(val)), "Unidades debe ser un número válido")
        .refine((val) => Number(val) > 0, "Unidades debe ser mayor a 0"),
    defectos: z.string()
        .min(1, "Defectos es requerido")
        .refine((val) => !isNaN(Number(val)), "Defectos debe ser un número válido")
        .refine((val) => Number(val) >= 0, "Defectos debe ser mayor o igual a 0"),
    calibre: z.string().min(1, "Calibre es requerido")
}).refine((data) => Number(data.unidades) > Number(data.defectos), {
    message: "Unidades debe ser mayor que defectos",
    path: ["unidades"]
});