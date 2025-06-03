/* eslint-disable prettier/prettier */

import { z } from "zod"

export const initFormState = {
    cliente: "",
    nombreConductor: "",
    telefono: "",
    cedula: "",
    remision: "",
    tipoFruta: "",
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
    nombreConductor: "Nombre del conductor",
    telefono: "Telefono",
    cedula: "Cedula",
    remision: "Remision",
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
    cliente: z.string().min(1, "El cliente es requerido"),
    nombreConductor: z.string().min(1, "El nombre del conductor es requerido"),
    telefono: z.string().min(1, "El teléfono es requerido"),
    cedula: z.string().min(1, "La cédula es requerida"),
    remision: z.string().min(1, "La remisión es requerida"),
    tipoFruta: z.string().min(1, "El tipo de fruta es requerido"),
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