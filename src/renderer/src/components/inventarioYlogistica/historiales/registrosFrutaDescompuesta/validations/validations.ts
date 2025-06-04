/* eslint-disable prettier/prettier */

import { z } from "zod"

export type formType = {
    tipoFruta: string,
    kilos: string,
    razon: string,
    comentario_adicional: string,
    "descarteLavado.descarteGeneral": string
    "descarteLavado.pareja": string
    "descarteLavado.balin": string
    "descarteEncerado.descarteGeneral": string
    "descarteEncerado.pareja": string
    "descarteEncerado.balin": string
    "descarteEncerado.extra": string
    "descarteEncerado.suelo": string
    "descarteEncerado.frutaNacional": string
}

export const initFormState = {
    tipoFruta: "",
    kilos: "",
    razon: "",
    comentario_adicional: "",
    "descarteLavado.descarteGeneral": "",
    "descarteLavado.pareja": "",
    "descarteLavado.balin": "",
    "descarteEncerado.descarteGeneral": "",
    "descarteEncerado.pareja": "",
    "descarteEncerado.balin": "",
    "descarteEncerado.extra": "",
    "descarteEncerado.suelo": "",
    "descarteEncerado.frutaNacional": "",
}

export const initFormKeys = {
    razon: "Razón",
    comentario_adicional: "Comentarios",
    "descarteLavado.descarteGeneral": "Descarte general lavado",
    "descarteLavado.pareja": "Pareja lavado",
    "descarteLavado.balin": "Balin lavado",
    "descarteEncerado.descarteGeneral": "Descarte general encerado",
    "descarteEncerado.pareja": "Pareja encerado",
    "descarteEncerado.balin": "Balin encerado",
    "descarteEncerado.extra": "Extra encerado",
    "descarteEncerado.suelo": "Suelo encerado",
    "descarteEncerado.frutaNacional": "Fruta nacional encerado",
}

export const formSchema = z.object({

    tipoFruta: z.string().min(1, "El tipo de fruta es requerido"),
    razon: z.string().min(1, "La razon es obligatoria"),
    comentario_adicional: z.string(),
    kilos: z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteLavado.descarteGeneral": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteLavado.pareja": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteLavado.balin": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.descarteGeneral": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.pareja": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.balin": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.extra": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.suelo": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    }),
    "descarteEncerado.frutaNacional": z.string().refine((val) => val === "N/A" || (!isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val))), {
        message: "Debe ser un número entero positivo o N/A"
    })
})