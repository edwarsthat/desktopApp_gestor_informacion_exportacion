/* eslint-disable prettier/prettier */

// import { format } from 'date-fns'
import { graficaDataType, graficaDonaDataType } from '../type/types'
import { lotesType } from '@renderer/types/lotesType'
// import { KEYS_FILTROS_COL } from './constantes'
import { sumaDescarte, totalDescarteLotes } from '@renderer/functions/operacionesLotes'
type calibreType = {
  [key: string]: {
    cajas: number,
    kilos: number
  }
}
export const filtrosColumnasObj = {
  canastillas: false,
  kilos: false,
  placa: false,
  kilosVaciados: false,
  promedio: false,
  rendimiento: false,
  descarteLavado: false,
  descarteEncerado: false,
  directoNacional: false,
  frutaNacional: false,
  desverdizado: false,
  exportacion: false,
  kilosGGN: false,
  contenedores: false,
  observaciones: false,
  deshidratacion: false,
  deshidratacionKilos: false,
  exportacionCalidad: false,
  calibreExportacion: false,
  fecha_creacion: false,
  fecha_estimada_llegada: false,
  fecha_ingreso_inventario: false,
  fechaProceso: false
}

export const datosGraficas = (datos: lotesType[]): graficaDataType[] => {
  const prediosTotal = datos.map((lote) => lote.predio?.PREDIO)
  const prediosSet = new Set(prediosTotal)
  const predios = [...prediosSet]

  const salida = predios.map((nombrepredio) => {
    nombrepredio = nombrepredio || '';
    const datosFiltrados = datos.filter((item) => item.predio?.PREDIO === nombrepredio)
    const cantidadDatos = datosFiltrados.length

    let kilosProm = 0
    let kilosVaciadosProm = 0
    let descarteLavadoProm = 0
    let descarteEnceradoProm = 0
    let exportacionProm = 0

    for(const lote of datosFiltrados){
      kilosProm += lote.kilos || 0;
      kilosVaciadosProm += lote.kilosVaciados || 0;
      descarteLavadoProm += sumaDescarte(lote, 'descarteLavado');
      descarteEnceradoProm += sumaDescarte(lote, 'descarteEncerado');
      exportacionProm += lote?.salidaExportacion?.totalKilos || 0;
    }

    kilosProm = kilosProm / cantidadDatos || 0;
    kilosVaciadosProm = kilosVaciadosProm / cantidadDatos || 0;
    descarteLavadoProm = descarteLavadoProm / cantidadDatos || 0;
    descarteEnceradoProm = descarteEnceradoProm / cantidadDatos || 0;
    exportacionProm = exportacionProm / cantidadDatos || 0;

    return {
      nombrePredio: nombrepredio,
      kilos: kilosProm,
      kilosVaciados: kilosVaciadosProm,
      descarteLavado: descarteLavadoProm,
      descarteEncerado: descarteEnceradoProm,
      exportacion: exportacionProm
    }
  })
  return salida
}
// export const datosGraficasCalidad = (datos: lotesType[]): graficaDataTypeCalidad[] => {
//   const prediosTotal = datos.map((lote) => lote.predio?.PREDIO)
//   const prediosSet = new Set(prediosTotal)
//   const predios = [...prediosSet]
//   const salida = predios.map((nombrepredio) => {
//     nombrepredio = nombrepredio || '';
//     const acidezPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "acidez")
//     const brixPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "brix")
//     const ratioPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "ratio")
//     const pesoPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "peso")
//     const zumoPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "zumo")

//     return {
//       nombrePredio: nombrepredio,
//       acidez: acidezPromedio,
//       brix: brixPromedio,
//       ratio: ratioPromedio,
//       peso: pesoPromedio,
//       zumo: zumoPromedio
//     }
//   })
//   return salida
// }
// export const datosGraficasHistogramaCalidad = (datos: lotesType[]): graficaDataTypeCalidad[] => {
//   const fechaTotal = datos.map((lote) => format(lote.fechaIngreso ? new Date(lote.fechaIngreso) : new Date(), 'dd-MM-yyyy'))
//   const fechasSet = new Set(fechaTotal)
//   const fechas = [...fechasSet]
//   const salida = fechas.map((fecha) => {
//     const acidezPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "acidez")
//     const brixPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "brix")
//     const ratioPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "ratio")
//     const pesoPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "peso")
//     const zumoPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "zumo")

//     return {
//       nombrePredio: fecha,
//       acidez: acidezPromedio,
//       brix: brixPromedio,
//       ratio: ratioPromedio,
//       peso: pesoPromedio,
//       zumo: zumoPromedio
//     }
//   })
//   return salida
// }
export const datosGraficaDona = (datos: lotesType[]): graficaDonaDataType => {
  const totalDescarteEncerado = totalDescarteLotes(datos, 'descarteEncerado');
  const totalDescarteLavado = totalDescarteLotes(datos, 'descarteLavado');

  const totalDeshidratacion = datos.reduce((acu, kilos) => (acu += kilos.deshidratacion ? kilos.deshidratacion : 0), 0)
  const totalFrutaNacional = datos.reduce((acu, kilos) => (acu += kilos.frutaNacional ? kilos.frutaNacional : 0), 0)
  const totalDirectoNacional = datos.reduce((acu, kilos) => (acu += kilos.directoNacional ? kilos.directoNacional : 0), 0)

  const totalExportacion = datos.reduce((acu, kilos) => (acu += kilos.salidaExportacion.totalKilos ? kilos.salidaExportacion.totalKilos : 0), 0)

  const total = totalDescarteEncerado + totalDescarteLavado + totalExportacion + totalDeshidratacion + totalFrutaNacional + totalDirectoNacional

  const porcentajedescarteEncerado = (totalDescarteEncerado * 100) / total;
  const porcentajedescarteLavado = (totalDescarteLavado * 100) / total;
  const porcentajeDeshidratacion = (totalDeshidratacion * 100) / total;
  const porcentajeExportacion = (totalExportacion * 100) / total;
  const porcentajeFrutaNacional = (totalFrutaNacional * 100) / total;
  const porcentajeDirectoNacionall = (totalDirectoNacional * 100) / total;

  return {
    descarteEncerado: porcentajedescarteEncerado,
    descarteLavado: porcentajedescarteLavado,
    desHidratacion: porcentajeDeshidratacion,
    exportacion: porcentajeExportacion,
    frutaNacional: porcentajeFrutaNacional,
    directoNacional: porcentajeDirectoNacionall
  }
}

// export const ordenarDataExcel = (data: lotesType[], columns, contenedores): object[] => {
//   const arrOut = data.map(item => {
//     const outObj = {
//       "EF1": item.enf,
//       predio: item.predio?.PREDIO,
//       "Fecha de ingreso": item.fechaIngreso,
//       "Tipo de fruta": item.tipoFruta
//     }
//     Object.keys(columns).map(key => {
//       if (key === "descarteEncerado" || key === 'descarteLavado') {
//         const descartes = item[key];
//         if (descartes) {
//           outObj[KEYS_FILTROS_COL[key]] = Object.values(descartes).reduce((acu, descarte) => acu += descarte, 0)

//         }
//       } else if (key === "contenedores") {
//         const numCont = item[key];
//         if (numCont) {
//           const numeroContenedor = numCont.reduce((acu, cont) => {
//             if (contenedores[cont]) {
//               acu += contenedores[cont] + ' - ';
//             }
//             return acu;
//           })
//           outObj[KEYS_FILTROS_COL[key]] = numeroContenedor;
//         }

//       } else if (key === 'exportacion') {
//         outObj[KEYS_FILTROS_COL[key]] = item.calidad1 + item.calidad15 + item.calidad2
//       } else {
//         outObj[KEYS_FILTROS_COL[key]] = item[key]
//       }
//     });

//     return outObj
//   })
//   return arrOut
// }
// export const ordenarDataExcelCalidad = (data: lotesType[]): object[] => {
//   const arrOut = data.map(item => {
//     const outObj = {
//       "EF1": item.enf,
//       predio: item.predio?.PREDIO,
//       "Fecha de ingreso": item.fechaIngreso,
//       "Fecha calidad interna": item.calidad?.calidadInterna?.fecha,
//       "Tipo de fruta": item.tipoFruta,
//       "Acidez": item.calidad?.calidadInterna?.acidez,
//       "Brix": item.calidad?.calidadInterna?.brix,
//       "Ratio": item.calidad?.calidadInterna?.ratio,
//       "Peso": item.calidad?.calidadInterna?.peso,
//       "Zumo": item.calidad?.calidadInterna?.zumo,
//     }
//     return outObj

//   })
//   return arrOut

// }


export const total_porcentaje_calibre = (calibres: calibreType, calibre: string): number => {
  const total_kilos = Object.values(calibres).reduce((acu, item) => acu += item.kilos, 0);
  if (total_kilos === 0) return 0

  const porcentage = (calibres[calibre].kilos * 100) / total_kilos
  return porcentage
}