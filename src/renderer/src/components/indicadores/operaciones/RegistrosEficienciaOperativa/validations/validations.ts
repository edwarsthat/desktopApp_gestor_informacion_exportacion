/* eslint-disable prettier/prettier */

import { z } from "zod";

export const initForm = {
    duracion_turno_horas: "",
    kilos_meta_hora: "",
}

export type FormType = {
    duracion_turno_horas: string;
    kilos_meta_hora: string;
}

export const formKeys = {
    duracion_turno_horas: "Duracion turno (horas)",
    kilos_meta_hora: "Kilos meta procesados (hora)",
}

export const formSchema = z.object({
    duracion_turno_horas: z.string().min(1, { message: "Duración del turno es requerida" })
        .refine(value => !isNaN(Number(value)), { message: "Duración del turno debe ser un número" }),
    kilos_meta_hora: z.string().min(1, { message: "Kilos meta procesados es requerido" })
        .refine(value => !isNaN(Number(value)), { message: "Kilos meta procesados debe ser un número" }),
})

