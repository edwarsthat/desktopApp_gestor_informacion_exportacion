/* eslint-disable prettier/prettier */
const ExcelJS = require("exceljs");

// process.parentPort.on('message', async (data) => {

//     const datos = await JSON.parse(data.data)
//     console.log("Datos recibidos en el proceso hijo:", datos);
// })

process.parentPort.on('message', async (data) => {
    // Si data.data ya es un objeto, no necesitas JSON.parse
    try {

        // const datos = await JSON.parse(data.data)
        const datos = data.data
        const filePath = datos.path; // Asegúrate de enviar el path
        const datosTabla = datos.data; // Asegúrate de enviar los datos de la tabla

        if (!Array.isArray(datosTabla) || datosTabla.length === 0) {
            process.send && process.send({ error: 'No hay datos para crear el Excel.' });
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Datos');

        // Extrae columnas dinámicamente
        const columns = Object.keys(datosTabla[0]).map(key => ({ header: key, key }));

        worksheet.columns = columns;

        // Agrega los datos
        worksheet.addRows(datosTabla);

        // Ajusta ancho de columnas automáticamente
        worksheet.columns.forEach(col => {
            col.width = Math.max(
                col.header.length,
                ...datosTabla.map(row => (row[col.key] ? String(row[col.key]).length : 10))
            ) + 2;
        });

        await workbook.xlsx.writeFile(filePath);
        // Notifica al proceso padre (main)
        process.send && process.send({ ok: true, ruta: filePath });
    } catch (err) {
        console.log(err)
        process.send && process.send({ error: err.message });
    }
})