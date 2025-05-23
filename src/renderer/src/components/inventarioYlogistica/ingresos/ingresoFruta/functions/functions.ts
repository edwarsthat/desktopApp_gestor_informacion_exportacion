/* eslint-disable prettier/prettier */


interface FormState {
  predio: string
  promedio: number
  numeroPrecintos: string
  canastillas: number
  kilos: string
  placa: string
  tipoFruta: string
  GGN: string
  fecha_estimada_llegada: string,
  observaciones: string
  ef?: string
}

export const crear_request_guardar = (formState): FormState => {
  const canastillas = (Number(formState.canastillasPrestadas) ?? 0) + 
                    (Number(formState.canastillasPropias) ?? 0) 
  return {
    ef: formState.ef,
    predio: formState.nombrePredio,
    promedio: Number(formState.kilos) / Number(canastillas),
    numeroPrecintos: formState.numeroPrecintos,
    canastillas: canastillas,
    kilos: formState.kilos,
    placa: formState.placa,
    tipoFruta: formState.tipoFruta,
    GGN: formState.GGN,
    fecha_estimada_llegada: formState.fecha_estimada_llegada,
    observaciones: formState.observaciones,
  }
}


