/* eslint-disable prettier/prettier */
const ExcelJS = require("exceljs");
const path = require("path");

const { format, parseISO } = require("date-fns");
const { es } = require('date-fns/locale');
const { toZonedTime } = require('date-fns-tz');
const PAISES_DEL_CARIBE = ["Republica dominicana", "Puerto rico", "ISLAS DEL CARIBE", "GUADALUPE", "MARTINICA", "ISLAS FRANCESAS"]


const formatearFecha = (fechaString, hora = false) => {
   if (!fechaString) {
      return '';
   }

   const zonaHoraria = 'America/Bogota';

   // Analizar la fecha UTC
   const fechaUTC = parseISO(fechaString);

   // Convertir a la zona horaria de Bogotá
   const fechaBogota = toZonedTime(fechaUTC, zonaHoraria);

   // Formatear la fecha
   if (hora) {
      return format(fechaBogota, 'dd/MM/yyyy HH:mm:ss', { locale: es });
   }

   return format(fechaBogota, 'dd/MM/yyyy', { locale: es });
};
const label = {
   Limon: "TAHITI",
   Naranja: "ORANGE"
}
const styleNormalCell = {
   top: { style: 'medium' },
   left: { style: 'medium' },
   bottom: { style: 'medium' },
   right: { style: 'medium' }
};
const mostrarKilose = (item) => {
   const peso = Number(item.tipoCaja.split("-")[1]);

   if (peso >= 18) return "40LB";
   if (peso >= 17) return "37LB";
   if (peso >= 15) return "35LB";
   if (peso >= 13) return "30LB";
   if (peso > 4 && peso < 5) return ("4,5Kg");
}
function aplicar_ggn_code(item, contenendor) {
   if (
      item.lote?.GGN &&
      item.lote.GGN.code &&
      item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
   ) {
      if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
         const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
         const lote = item.lote.GGN.paises
         if (lote.some(elemento => cont.includes(elemento))) {
            return item.lote.GGN.code
         }
      }
   }
   return ""
}
function aplicar_ggn_fecha(item, contenendor) {
   if (
      item.lote?.GGN &&
      item.lote.GGN.code &&
      item.lote.GGN.tipo_fruta.includes(item.tipoFruta)
   ) {
      if (typeof contenendor.infoContenedor.clienteInfo === 'object') {
         const cont = contenendor.infoContenedor.clienteInfo.PAIS_DESTINO;
         const lote = item.lote.GGN.paises
         if (lote.some(elemento => cont.includes(elemento))) {
            return item.lote.GGN.fechaVencimiento
         }
      }
   }
   return ""
}
function resumenCalidad(contenedor, calidad) {
   const out = {}
   let total = 0;

   contenedor.pallets.forEach((pallet) => {
      let palletFlag = false
      const calibre = new Set()
      pallet.EF1.forEach(item => {
         total += item.cajas
         if (item.calidad === calidad) {
            if (!Object.prototype.hasOwnProperty.call(out, item.calibre)) {
               out[item.calibre] = {
                  cantidad: 0,
                  pallets: 0,
               }
            }
            out[item.calibre].cantidad += item.cajas
            palletFlag = true
            calibre.add(item.calibre)
         }
      })
      if (palletFlag) {
         const arrCalibre = [...calibre]
         arrCalibre.forEach(cal => {
            out[cal].pallets += 1
         })
      }
   })

   Object.keys(out).forEach(item => {
      out[item].porcentage = (out[item].cantidad * 100) / total
   })
   return out
}
function resumenCalidadTipoCaribe(contenedor) {
   const out = {}
   let total = 0;

   contenedor.pallets.forEach((pallet) => {
      let palletFlag = false
      const calibre = new Set()
      pallet.EF1.forEach(item => {
         total += item.cajas
         if (!Object.prototype.hasOwnProperty.call(out, item.calibre)) {
            out[item.calibre] = {
               cantidad: 0,
               pallets: 0,
            }
         }
         out[item.calibre].cantidad += item.cajas
         palletFlag = true
         calibre.add(item.calibre)
      })
      if (palletFlag) {
         const arrCalibre = [...calibre]
         arrCalibre.forEach(cal => {
            out[cal].pallets += 1
         })
      }
   })

   Object.keys(out).forEach(item => {
      out[item].porcentage = (out[item].cantidad * 100) / total
   })
   return out
}
function isPaisesCaribe(contenedor) {
   if (contenedor.infoContenedor && contenedor.infoContenedor.clienteInfo) {
      for (const pais of contenedor.infoContenedor.clienteInfo.PAIS_DESTINO) {
         if (PAISES_DEL_CARIBE.includes(pais)) {
            return false;
         }
      }
   }
   return true;
}



async function crearDocumento(data) {
   const table = await JSON.parse(data.data.data)
   const workbook = new ExcelJS.Workbook();
   let worksheet = workbook.addWorksheet("Table")

   const headers = Object.keys(table[0]);

   worksheet.insertRow(1, headers);

   table.forEach(row => {
      worksheet.addRow(Object.values(row));
   });

   await workbook.xlsx.writeFile(data.data.path);

}

const nombreTipoFruta2 = (tipoFruta, tiposFrutas) => {
   if (!tipoFruta) return "N/A";
   const fruta = tiposFrutas.find(item => item._id === tipoFruta);
   return fruta ? fruta.tipoFruta : tipoFruta;
}
const tipoCalidad = (calidadId, tiposFrutas) => {
   const calidad = "N/A";
   if (!calidadId) return "N/A";
   for (const tf of tiposFrutas) {
      for (const calidad of tf.calidades) {
         if (calidad._id === calidadId) {
            return calidad.nombre;
         }
      }
   }
   return calidad;
}

//#region reporte_predios_lista_empaque
async function crear_reporte_predios(data, pathDocument) {
   const cont = data.contenedor
   const tabla = data.tabla
   const predios = tabla[0]
   const totalCajas = tabla[1]
   const totalKilos = tabla[2]

   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Reporte Predios")

   const styleNormalCell = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
   };


   //? logo
   const logo = worksheet.getCell('A1')
   logo.border = styleNormalCell
   logo.alignment = { horizontal: 'center', vertical: 'middle' }

   worksheet.getColumn(1).width = 20
   worksheet.getRow(1).height = 80

   const imagePath = path.resolve(
      __dirname,
      '..',
      'renderer',
      'assets',
      '1-DM4AKfsC.webp'
   )
   const imageId = workbook.addImage({
      filename: imagePath,
      extension: 'png'
   })

   worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 100 }
   })




   //? titulo
   worksheet.getColumn(2).width = 20
   worksheet.getColumn(4).width = 20
   worksheet.getColumn(5).width = 30

   const titulo = worksheet.getCell('B1')
   titulo.value = "Reporte Predio ICA"
   worksheet.mergeCells('B1:D1');
   titulo.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   titulo.font = { size: 24, bold: true }
   titulo.border = styleNormalCell

   //?codigo version
   const version = worksheet.getCell('E1')
   version.value = `Codigo: PC-CAL-FOR-04
Versión: 03 
Fecha: 17 Oct 2020`
   version.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   version.font = { size: 12 }
   version.border = styleNormalCell

   //?cliente info
   const clienteLabel = worksheet.getCell('A2');
   clienteLabel.value = "CLIENTE:"
   clienteLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   clienteLabel.font = { size: 18, bold: true }
   clienteLabel.border = styleNormalCell

   const nombrCliente = worksheet.getCell('B2')
   worksheet.mergeCells('B2:E2');
   nombrCliente.value = cont.infoContenedor.clienteInfo.CLIENTE
   nombrCliente.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   nombrCliente.font = { size: 18, bold: true }
   nombrCliente.border = styleNormalCell

   const fechaLabel = worksheet.getCell('A3')
   fechaLabel.value = "FECHA:"
   fechaLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   fechaLabel.font = { size: 18, bold: true }
   fechaLabel.border = styleNormalCell

   const fechaCont = worksheet.getCell('B3')
   worksheet.mergeCells('B3:E3');
   fechaCont.value = new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
   })
   fechaCont.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   fechaCont.font = { size: 18, bold: true }
   fechaCont.border = styleNormalCell

   //? los headers de la tabla
   worksheet.insertRow(4, ['Predio', 'Codigo ICA', 'N° Cajas', 'Peso Neto', 'Peso Bruto'])
   for (let i = 1; i <= 5; i++) {
      const cell = worksheet.getCell(4, i);
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'FF5FD991' }
      }
      cell.border = styleNormalCell
   }

   //? los datos de los predios
   Object.values(predios).forEach((value, index) => {
      worksheet.insertRow(5 + index, [
         value.predio,
         value.SISPAP ? value.ICA : 'Sin SISPAP',
         value.cajas,
         value.peso,
         value.peso + (0.85 * value.cajas)
      ])

      for (let i = 1; i <= 5; i++) {
         const cell = worksheet.getCell(5 + index, i);
         cell.font = { size: 12 };
         cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
         cell.border = styleNormalCell
      }
   })

   //? total 
   let ultimaFila = Object.keys(predios).length;
   const totalLabel = worksheet.getCell(ultimaFila + 5, 1);
   worksheet.mergeCells(`A${ultimaFila + 5}:B${ultimaFila + 5}`);
   totalLabel.value = "TOTAL:"
   totalLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalLabel.font = { size: 14, bold: true }
   totalLabel.border = styleNormalCell
   totalLabel.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalCajascell = worksheet.getCell(ultimaFila + 5, 3);
   totalCajascell.value = totalCajas
   totalCajascell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalCajascell.font = { size: 14, bold: true }
   totalCajascell.border = styleNormalCell
   totalCajascell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalKilosCell = worksheet.getCell(ultimaFila + 5, 4);
   totalKilosCell.value = totalKilos
   totalKilosCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalKilosCell.font = { size: 14, bold: true }
   totalKilosCell.border = styleNormalCell
   totalKilosCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const totalKilosNetos = worksheet.getCell(ultimaFila + 5, 5);
   totalKilosNetos.value = totalKilos + (totalCajas * 0.85)
   totalKilosNetos.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalKilosNetos.font = { size: 14, bold: true }
   totalKilosNetos.border = styleNormalCell
   totalKilosNetos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }




   await workbook.xlsx.writeFile(pathDocument);

}

const setCellProperties = (cell, value, font = 14, bold = false) => {
   cell.value = value
   cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   cell.font = { size: font, bold: bold }
   cell.border = styleNormalCell

};


async function crear_lista_empaque(data, pathDocument) {
   const cont = data.contenedor
   const tipoFrutas = data.tiposFrutas
   const isNotCaribe = isPaisesCaribe(cont);
   // const proveedores = data.proveedores
   const fuente = 16
   const alto_celda = 50

   let coc_flag = false;
   let row1Cells;
   let row2cells;
   let row3Cells;

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
      row1Cells = [
         { cell: 'C1', value: "PACKING LIST REPORT", font: 24, bold: true },
         { cell: 'K1', value: "Codigo: PC-CAL-FOR-05", font: fuente, bold: true },
      ]

      row2cells = [
         { cell: 'A2', value: "CLIENTE", font: fuente, bold: true },
         { cell: 'B2', value: cont.infoContenedor.clienteInfo.CLIENTE, font: fuente, bold: false },
         { cell: 'D2', value: "TEMP. SET POINT:", font: fuente, bold: true },
         { cell: 'E2', value: "44,6F", font: fuente, bold: false },
         { cell: 'F2', value: "FREIGHT:", font: fuente, bold: true },
         { cell: 'G2', value: "", font: fuente, bold: false },
         { cell: 'H2', value: "CONTAINER NUMBER:", font: fuente, bold: true },
         { cell: 'I2', value: cont.numeroContenedor, font: fuente, bold: false },
         { cell: 'J2', value: "REFERENCE N°:", font: fuente, bold: true },
         { cell: 'K2', value: cont.infoContenedor.tipoFruta.reduce((acu, item) => acu + (nombreTipoFruta2(item, tipoFrutas) + " - " || ""), ""), font: fuente, bold: false },
      ]

      row3Cells = [
         { cell: 'A3', value: "TEMP RECORDER LOCATION:", font: fuente, bold: true },
         { cell: 'C3', value: "PALLET 10", font: fuente, bold: false },
         { cell: 'D3', value: "TEMP RECORDER ID: ", font: fuente, bold: true },
         { cell: 'F3', value: "SS-0085719", font: fuente, bold: false },
         { cell: 'G3', value: "DATE: ", font: fuente, bold: true },
         {
            cell: 'H3', value: new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric'
            }), font: fuente, bold: false
         },
         { cell: 'J3', value: "CoC: ", font: fuente, bold: true },
         { cell: 'K3', value: "N/A", font: fuente, bold: false },
      ]
   } else {
      row1Cells = [
         { cell: 'C1', value: "PACKING LIST REPORT", font: 24, bold: true },
         { cell: 'J1', value: "Codigo: PC-CAL-FOR-05", font: fuente, bold: true },
      ]

      row2cells = [
         { cell: 'A2', value: "CLIENTE", font: fuente, bold: true },
         { cell: 'B2', value: cont.infoContenedor.clienteInfo.CLIENTE, font: fuente, bold: false },
         { cell: 'D2', value: "TEMP. SET POINT:", font: fuente, bold: true },
         { cell: 'E2', value: "44,6F", font: fuente, bold: false },
         { cell: 'F2', value: "FREIGHT:", font: fuente, bold: true },
         { cell: 'G2', value: "CONTAINER NUMBER:", font: fuente, bold: true },
         { cell: 'H2', value: cont.numeroContenedor, font: fuente, bold: false },
         { cell: 'I2', value: "REFERENCE N°:", font: fuente, bold: true },
         { cell: 'J2', value: cont.infoContenedor.tipoFruta.reduce((acu, item) => acu + (nombreTipoFruta2(item, tipoFrutas) + " - " || ""), ""), font: fuente, bold: false },
      ]

      row3Cells = [
         { cell: 'A3', value: "TEMP RECORDER LOCATION:", font: fuente, bold: true },
         { cell: 'C3', value: "PALLET 10", font: fuente, bold: false },
         { cell: 'D3', value: "TEMP RECORDER ID: ", font: fuente, bold: true },
         { cell: 'F3', value: "SS-0085719", font: fuente, bold: false },
         { cell: 'G3', value: "DATE: ", font: fuente, bold: true },
         {
            cell: 'H3', value: new Date(cont.infoContenedor.fechaFinalizado).toLocaleDateString('es-ES', {
               day: '2-digit',
               month: '2-digit',
               year: 'numeric'
            }), font: fuente, bold: false
         },
         { cell: 'I3', value: "CoC: ", font: fuente, bold: true },
         { cell: 'J3', value: "N/A", font: fuente, bold: false },
      ]
   }



   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Lista empaque")



   worksheet.getRow(1).height = 80
   for (let i = 1; i <= 12; i++) {
      worksheet.getColumn(i).width = 20.33
      worksheet.getColumn(i).height = alto_celda
   }

   worksheet.getRow(2).height = alto_celda
   worksheet.getRow(3).height = alto_celda



   //? logo
   const logo = worksheet.getCell('A1')

   logo.border = styleNormalCell
   logo.alignment = { horizontal: 'center', vertical: 'middle' }


   const imagePath = path.resolve(
      __dirname,
      '..',
      'renderer',
      'assets',
      '1-DM4AKfsC.webp'
   )
   const imageId = workbook.addImage({
      filename: imagePath,
      extension: 'png'
   })


   worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 100 }
   });

   const cellImage = worksheet.getCell("A1")
   cellImage.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }


   //? titulo
   row1Cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })
   row2cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })
   row3Cells.forEach(item => {
      const cell = worksheet.getCell(item.cell)
      setCellProperties(cell, item.value, item.font, item.bold)
   })

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {

      worksheet.mergeCells(`A1:B1`);
      worksheet.mergeCells(`C1:J1`);
      worksheet.mergeCells('B2:C2');
      worksheet.mergeCells('A3:B3');
      worksheet.mergeCells('D3:E3');
      worksheet.mergeCells('H3:I3');
   } else {
      worksheet.mergeCells(`A1:B1`);
      worksheet.mergeCells(`C1:I1`);
      worksheet.mergeCells('B2:C2');
      worksheet.mergeCells('A3:B3');
      worksheet.mergeCells('D3:E3');
   }

   //? los headers de la tabla
   const headers = cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e" ? [
      "PALLET ID",
      "PACKING DATE",
      "VARIETY",
      "PRODUCT",
      "WEIGHT",
      "CATEGORY",
      "SIZE",
      "QTY",
      "FARM CODE",
      "N° GG",
      "EXPIRATION DATE"
   ] : [
      "PALLET ID",
      "PACKING DATE",
      "VARIETY",
      "WEIGHT",
      "CATEGORY",
      "SIZE",
      "QTY",
      "FARM CODE",
      "N° GG",
      "EXPIRATION DATE"
   ]
   const headerRow = worksheet.insertRow(4, headers)
   headerRow.height = alto_celda

   const len = cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e" ? 11 : 10;
   for (let i = 1; i <= len; i++) {
      const cell = worksheet.getCell(4, i);
      cell.font = { bold: true, size: 15 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
         type: 'pattern',
         pattern: 'solid',
         fgColor: { argb: 'FF5FD991' }
      }
      cell.border = styleNormalCell
   }
   let totalCajas = 0
   let row = 5
   cont.pallets.forEach((_, index) => {
      cont.pallets[index].EF1.forEach((item) => {
         if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
            const newRow = worksheet.insertRow(row, [
               String(index + 1) + String(cont.numeroContenedor),
               formatearFecha(item.fecha, true),
               label[nombreTipoFruta2(item.tipoFruta, tipoFrutas)],
               "COL-" + mostrarKilose(item) + (item.tipoFruta === 'Limon' ? 'Limes' : 'Oranges') + item.calibre + "ct",
               mostrarKilose(item),
               isNotCaribe ? tipoCalidad(item.calidad, tipoFrutas) : "Caribe",
               item.calibre,
               item.cajas,
               item.lote.SISPAP ? item.lote.ICA.code : 'Sin SISPAP',
               aplicar_ggn_code(item, cont) !== "" ? aplicar_ggn_code(item, cont) : "N/A",
               aplicar_ggn_fecha(item, cont) !== "" ?
                  formatearFecha(aplicar_ggn_fecha(item, cont)) : "N/A"
            ])

            newRow.height = alto_celda;
            newRow.width = 20;
         } else {
            const newRow = worksheet.insertRow(row, [
               String(index + 1) + String(cont.numeroContenedor),
               formatearFecha(item.fecha, true),
               label[nombreTipoFruta2(item.tipoFruta, tipoFrutas)],
               mostrarKilose(item),
               isNotCaribe ? tipoCalidad(item.calidad, tipoFrutas) : "Caribe",
               item.calibre,
               item.cajas,
               item.lote.SISPAP ? item.lote.ICA.code : 'Sin SISPAP',
               aplicar_ggn_code(item, cont) !== "" ? aplicar_ggn_code(item, cont) : "N/A",
               aplicar_ggn_fecha(item, cont) !== "" ?
                  formatearFecha(aplicar_ggn_fecha(item, cont)) : "N/A"
            ])

            newRow.height = alto_celda;
            newRow.width = 20.33;
         }

         if (!coc_flag && aplicar_ggn_code(item, cont) !== "") {
            coc_flag = true
         }
         totalCajas += item.cajas;
         for (let i = 1; i <= len; i++) {
            const cell = worksheet.getCell(row, i);
            cell.font = { size: fuente };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = styleNormalCell
         }
         row++;
      })
   })

   const totalLabel = worksheet.getCell(row, 1)
   totalLabel.value = "TOTAL"
   worksheet.getRow(row).height = alto_celda

   if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.mergeCells(`G${row}:K${row}`);

   } else {
      worksheet.mergeCells(`A${row}:E${row}`);
      worksheet.mergeCells(`F${row}:J${row}`);

   }
   totalLabel.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   totalLabel.font = { size: 12 }
   totalLabel.border = styleNormalCell
   totalLabel.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }

   const total = worksheet.getCell(row, 7)
   total.value = totalCajas
   total.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
   total.font = { size: 12 }
   total.border = styleNormalCell
   total.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF5FD991' }
   }
   //?las tablas de resumen por calidad

   row += 2;
   worksheet.getRow(row).height = alto_celda

   for (const calidad of cont.infoContenedor.calidad) {
      //head
      worksheet.insertRow(row, [
         "SUMMARY CATEGORY",
         isNotCaribe ? tipoCalidad(calidad, tipoFrutas) : "Caribe",

      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: fuente };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }

      row++;
      worksheet.getRow(row).height = alto_celda

      //columnas
      worksheet.insertRow(row, [
         "SIZE",
         "QTY",
         "N.PALLETS",
         "% PERCENTAGE",
      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: fuente };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }
      row++;
      worksheet.getRow(row).height = alto_celda

      const resumen = isNotCaribe ? resumenCalidad(cont, calidad) : resumenCalidadTipoCaribe(cont)

      //datos
      Object.entries(resumen).forEach(([key, value]) => {
         worksheet.insertRow(row, [
            key,
            value.cantidad,
            value.pallets,
            value.porcentage.toFixed(2) + "%",
         ])
         for (let i = 1; i <= 4; i++) {
            const cell = worksheet.getCell(row, i);
            cell.font = { size: 12 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = styleNormalCell
         }

         row++;
         worksheet.getRow(row).height = alto_celda

      })

      worksheet.insertRow(row, [
         "TOTAL",
         Object.keys(resumen).reduce((acu, item) => acu += resumen[item].cantidad, 0),
         Object.keys(resumen).reduce((acu, item) => acu += resumen[item].pallets, 0),
         resumen && Object.keys(resumen).reduce((acu, item) => acu += resumen[item].porcentage, 0).toFixed(2) + "%",
      ])
      for (let i = 1; i <= 4; i++) {
         const cell = worksheet.getCell(row, i);
         cell.font = { bold: true, size: 12 };
         cell.alignment = { horizontal: 'center', vertical: 'middle' };
         cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF5FD991' }
         }
         cell.border = styleNormalCell
      }


      row += 2;
      worksheet.getRow(row).height = alto_celda

      if (coc_flag) {
         if (cont.infoContenedor.clienteInfo._id === "659dbd9a347a42d89929340e") {
            const cell = worksheet.getCell("K3")
            cell.value = "4063061801296"
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.font = { size: fuente, bold: false }
            cell.border = styleNormalCell
         } else {
            const cell = worksheet.getCell("J3")
            cell.value = "4063061801296"
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
            cell.font = { size: fuente, bold: false }
            cell.border = styleNormalCell
         }

      }

      if (!isNotCaribe) break;

   }

   await workbook.xlsx.writeFile(pathDocument);

}


//!el entry
process.parentPort.on('message', async (data) => {

   const datos = await JSON.parse(data.data)
   // console.log(datos.action)
   try {
      if (datos.action === 'crear_resporte_predios_lista_empaque') {
         await crear_reporte_predios(datos.data, datos.path);
      } else if (datos.action === 'crear_lista_empaque') {
         await crear_lista_empaque(datos.data, datos.path)
      } else {
         await crearDocumento(data)
      }
   } catch (error) {
      console.log(error)
   }

})

