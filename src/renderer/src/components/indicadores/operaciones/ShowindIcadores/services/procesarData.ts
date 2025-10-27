/* eslint-disable prettier/prettier */

// import { totalesLotesType } from "../validations/types";

// Funciones comentadas porque no se usan actualmente
// export const porcentajeCalibreLotes = (totales: totalesLotesType, calibre: string): string => {
//     const total = Object.values(totales.calibresTotal).reduce((acc, curr) => acc + curr.kilos, 0);

//     const calibreData = totales.calibresTotal[calibre];
//     if (calibreData) {
//         const porcentaje = total > 0 ? ((calibreData.kilos / total) * 100).toFixed(2) + '%' : '0%';
//         return `${porcentaje}`;
//     }
//     return "0%"
// }

// export const totalSumatoriaCalibreLotes = (totales: totalesLotesType): number => {
//     return Object.values(totales.calibresTotal).reduce((acc, curr) => acc + curr.kilos, 0) || 0;
// }

export function generateColors(count): string[] {
    const colors = [
        'rgba(34, 197, 94, 0.8)',    // verde
        'rgba(234, 179, 8, 0.8)',    // amarillo
        'rgba(139, 92, 246, 0.8)',   // violeta
        'rgba(16, 185, 129, 0.8)',   // verde agua
        'rgba(253, 224, 71, 0.8)',   // amarillo claro
        'rgba(251, 191, 36, 0.8)',   // naranja
        'rgba(168, 85, 247, 0.8)',   // violeta claro
        'rgba(244, 63, 94, 0.8)',    // rosado fuerte
        'rgba(132, 204, 22, 0.8)',   // verde lima
        'rgba(236, 72, 153, 0.8)',   // fucsia
        'rgba(14, 165, 233, 0.8)',   // celeste
        'rgba(250, 204, 21, 0.8)',   // mostaza
        'rgba(6, 182, 212, 0.8)',    // turquesa
        'rgba(190, 24, 93, 0.8)',    // magenta oscuro
        'rgba(22, 163, 74, 0.8)',    // verde hoja
        'rgba(225, 29, 72, 0.8)',    // coral
        'rgba(249, 115, 22, 0.8)',   // naranja quemado
        'rgba(202, 138, 4, 0.8)',    // mostaza oscuro
        'rgba(245, 158, 11, 0.8)',   // dorado suave
        'rgba(132, 204, 22, 0.8)',   // verde limón (repetido para más opciones)
        'rgba(217, 70, 239, 0.8)',   // púrpura neón
        'rgba(59, 130, 246, 0.4)',   // azul claro y translúcido
        'rgba(94, 234, 212, 0.8)',   // agua clara
        'rgba(250, 204, 21, 0.7)',   // mostaza translúcido
        'rgba(251, 113, 133, 0.8)',  // rosa pastel
        'rgba(94, 234, 212, 0.7)',   // agua translúcido
        'rgba(34, 211, 238, 0.8)',   // cian intenso
        'rgba(251, 146, 60, 0.8)',   // naranja pastel
        'rgba(192, 132, 252, 0.8)',  // violeta pastel
        'rgba(34, 197, 94, 0.6)',    // verde translúcido
    ];
    // Si faltan colores, los repetimos con un twist de opacidad
    while (colors.length < count) {
        colors.push(colors[colors.length % 10].replace('0.8', (0.7 + Math.random() * 0.2).toFixed(2)));
    }
    return colors.slice(0, count);
}