/* eslint-disable prettier/prettier */
// import { getErrorMessages } from "@renderer/utils/error";
import { z } from "zod"
import { formType, inventarioDescarteType } from "../types/types"

export type formTypeOutput = z.infer<typeof formSchema> // lo que ya procesaste
export type formTypeInput = z.input<typeof formSchema>

export const initialForm = {
    tipoFruta: "",
    "descarteLavado:descarteGeneral": "",
    "descarteLavado:pareja": "",
    "descarteLavado:balin": "",
    "descarteEncerado:descarteGeneral": "",
    "descarteEncerado:pareja": "",
    "descarteEncerado:balin": "",
    "descarteEncerado:extra": "",
    "descarteEncerado:suelo": "",
    "descarteEncerado:frutaNacional": "",
}

export const formSchema = z.object({
    tipoFruta: z.string().min(1, "El tipo de fruta es obligatorio"),
    "descarteLavado:descarteGeneral": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteLavado:pareja": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteLavado:balin": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:descarteGeneral": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:pareja": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:balin": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:extra": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:suelo": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
    "descarteEncerado:frutaNacional": z.string()
        .refine(val => val === "" || !isNaN(parseInt(val)), "Debe ser un número válido")
        .refine(val => val === "" || parseInt(val) >= 0, "No puede ser un número negativo")
        .refine(val => val === "" || Number.isInteger(Number(val)), "No se permiten números decimales"),
})

export const validateKilos = (data: inventarioDescarteType, formState: formType): boolean => {
    // Validar descarte lavado
    const descarteLavadoData = {
        balin: parseInt(String(data.total.descarteLavado.balin) || "0"),
        descarteGeneral: parseInt(String(data.total.descarteLavado.descarteGeneral) || "0"),
        pareja: parseInt(String(data.total.descarteLavado.pareja) || "0")
    }

    const descarteEnceradoData = {
        balin: parseInt(String(data.total.descarteEncerado.balin) || "0"),
        descarteGeneral: parseInt(String(data.total.descarteEncerado.descarteGeneral) || "0"),
        pareja: parseInt(String(data.total.descarteEncerado.pareja) || "0"),
        extra: parseInt(String(data.total.descarteEncerado.extra) || "0"),
        suelo: parseInt(String(data.total.descarteEncerado.suelo) || "0"),
        frutaNacional: parseInt(String(data.total.descarteEncerado.frutaNacional) || "0")
    }

    // Validar descarte lavado
    if (
        descarteLavadoData.balin < parseInt(formState["descarteLavado:balin"] || "0") ||
        descarteLavadoData.descarteGeneral < parseInt(formState["descarteLavado:descarteGeneral"] || "0") ||
        descarteLavadoData.pareja < parseInt(formState["descarteLavado:pareja"] || "0")
    ) return false

    // Validar descarte encerado
    if (
        descarteEnceradoData.balin < parseInt(formState["descarteEncerado:balin"] || "0") ||
        descarteEnceradoData.descarteGeneral < parseInt(formState["descarteEncerado:descarteGeneral"] || "0") ||
        descarteEnceradoData.pareja < parseInt(formState["descarteEncerado:pareja"] || "0") ||
        descarteEnceradoData.extra < parseInt(formState["descarteEncerado:extra"] || "0") ||
        descarteEnceradoData.suelo < parseInt(formState["descarteEncerado:suelo"] || "0") ||
        descarteEnceradoData.frutaNacional < parseInt(formState["descarteEncerado:frutaNacional"] || "0")
    ) return false

    return true
}

export const initialDespachoFruta = {
    cliente: "",
    placa: "",
    nombreConductor: "",
    telefono: "",
    cedula: "",
    remision: "",
    kilos: 0,
}

export const despachoSchema = z.object({
    cliente: z.string().min(1, "El nombre del cliente es obligatorio"),
    placa: z.string()
        .length(6, "La placa debe tener exactamente 6 caracteres")
        .regex(/^[A-Z]{3}[0-9]{3}$/, "La placa debe tener 3 letras seguidas de 3 números"),
    nombreConductor: z.string().min(1, "El nombre del conductor es obligatorio"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
    cedula: z.string().min(1, "La cédula es obligatoria"),
    remision: z.string().min(1, "La remisión es obligatoria"),
    kilos: z.number().min(1, "Los kilos deben ser mayores a 0"),
})


export const formDescompuestaKeys = {
    razon: "Razón",
    comentario_adicional: "Comentario adicional"
}

export type formDescompuestaType = {
    razon: string
    comentario_adicional: string
}

export const initFormDescaompuesta = {
    razon: "",
    comentario_adicional: ""
}

export const descompuestaSchema = z.object({
    razon: z.string()
        .min(1, "La razón es obligatoria")
        .max(1000, "La razón no puede exceder los 1000 caracteres")
        .refine(
            (val) => !/[<>$]|javascript:|data:|vbscript:/.test(val),
            "El texto contiene caracteres no permitidos"
        ),
    comentario_adicional: z.string()
        .max(1000, "El comentario no puede exceder los 1000 caracteres")
        .refine(
            (val) => !/[<>$]|javascript:|data:|vbscript:/.test(val),
            "El texto contiene caracteres no permitidos"
        )
        .optional()
        .default("")
})
