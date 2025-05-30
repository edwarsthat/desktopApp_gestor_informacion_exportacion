/* eslint-disable prettier/prettier */

import { descarteEncerado, descarteLavadoType, formType, inventarioDescarteType } from "../types/types"

export const sumatoriaTipoDescarte = (data: descarteEncerado | descarteLavadoType, tipoDescarte: string): number => {
  if (!data) return 0
  if (tipoDescarte !== 'descarteLavado' && tipoDescarte !== 'descarteEncerado') return 0

  const sumatoria = Object.values(data).reduce((acu, item) => acu += Number(item), 0)

  return sumatoria
}

export const sumatoriaDescartesTotal = (data: inventarioDescarteType): number => {
  let totalOut = 0
  if (!data) return 0
  Object.keys(data).forEach(total => {
    if (!data[total]) return
    Object.keys(data[total]).forEach(tipoDescarte => {
      if (!data[total][tipoDescarte]) return
      Object.values(data[total][tipoDescarte]).forEach(item => {
        totalOut += Number(item)
      })
    })
  })
  return totalOut
}

export const sumatoriaTotalForm = (data: formType): number => {
  if (!data) return 0
  const total = Object.entries(data).reduce((acumulador, [key, value]) => {
    if(key === "tipoFruta") return 0
    else return acumulador += Number(value ?? 0) ?? 0
  }, 0);
  return total
}

