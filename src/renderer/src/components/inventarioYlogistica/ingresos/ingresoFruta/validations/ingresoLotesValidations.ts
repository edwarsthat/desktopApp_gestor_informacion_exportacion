/* eslint-disable prettier/prettier */
import { z } from "zod"

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema> // lo que viene del formulario


export type formType = {
    nombrePredio: string,
    tipoFruta: string,
    canastillasPropias: string
    canastillasPrestadas: string
    canastillasVaciasPropias: string
    canastillasVaciasPrestadas: string
    kilos: string
    GGN: string,
    placa: string,
    fecha_estimada_llegada: string
    numeroPrecintos: string
    observaciones: string
}

export const initialValues: formType = {
    nombrePredio: "",
    tipoFruta: "",
    canastillasPropias: "",
    canastillasPrestadas: "",
    canastillasVaciasPropias: "",
    canastillasVaciasPrestadas: "",
    kilos: "",
    GGN: "",
    placa: "",
    fecha_estimada_llegada: "",
    numeroPrecintos: "",
    observaciones: ""
}


export const formSchema = z.object({
    nombrePredio: z.string().min(1, "El nombre del predio es obligatorio"),
    tipoFruta: z.string().min(1, "El tipo de fruta es obligatorio"),
    GGN: z.string().min(1, "El GGN es obligatorio").transform(val => val === "true"),
    placa: z.string().min(1, "La placa es obligatoria"),
    numeroPrecintos: z.string().min(1, "El número de precintos es obligatorio"),

    fecha_estimada_llegada: z.string()
        .min(1, "La fecha estimada de llegada es obligatoria")
        .refine(val => !isNaN(Date.parse(val)), {
            message: "La fecha no es válida",
        }),

    kilos: z
        .string({ required_error: "Los kilos son obligatorios" })
        .min(1, "Los kilos son obligatorios")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Los kilos deben ser un número válido" })
        .refine(val => val > 0, { message: "Los kilos deben ser mayores a 0" }),

    canastillasPropias: z
        .string({ required_error: "Campo obligatorio" })
        .min(1, "Debe ingresar un número")
        .transform(val => Number(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número válido" })
        .refine(val => val >= 0, { message: "Debe ser mayor o igual a 0" }),

    canastillasPrestadas: z
        .string({ required_error: "Campo obligatorio" })
        .min(1, "Debe ingresar un número")
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

    observaciones: z.string().optional(),
})
    .refine((data) => {
        const {
            canastillasPropias = 0,
            canastillasPrestadas = 0,
            canastillasVaciasPropias = 0,
            canastillasVaciasPrestadas = 0
        } = data;

        const total =
            canastillasPropias +
            canastillasPrestadas +
            canastillasVaciasPropias +
            canastillasVaciasPrestadas;

        return total > 0;
    }, {
        message: "Debe ingresar al menos una canastilla (propia, prestada, vacía o llena)",
        path: ["canastillas"], // error virtual
    });


