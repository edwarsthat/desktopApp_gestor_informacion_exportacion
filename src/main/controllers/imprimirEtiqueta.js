/* eslint-disable prettier/prettier */
const mode = import.meta.env.MODE
let path
if (mode === 'development') {
  path = 'C:\\Users\\SISTEMA\\Documents\\apps\\AplicacionEscritorioCelifrutTypeScript\\tsclibnet.dll';
} else {
  path = './resources/app.asar.unpacked/tsclibnet.dll';

}

console.log(path)

const edge = require('electron-edge-js')

var about
var openport
var sendcommand
var clearbuffer
var printerfont
var barcode
var printlabel
var closeport
var printer_status
var sendcommand_utf8
var sendcommand_binary
var windowsfont
var formfeed
var nobackfeed
var setup


try {
  openport = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'openport'
  })
} catch (error) {
  console.log(error)
}

try {
  setup = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'setup'
  })
} catch (error) {
  console.log(error)
}
try {
  formfeed = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'formfeed'
  })
} catch (error) {
  console.log(error)
}

try {
  nobackfeed = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'nobackfeed'
  })
} catch (error) {
  console.log(error)
}

try {
  about = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'about'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand'
  })
} catch (error) {
  console.log(error)
}

try {
  clearbuffer = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'clearbuffer'
  })
} catch (error) {
  console.log(error)
}

try {
  printerfont = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'printerfont'
  })
} catch (error) {
  console.log(error)
}

try {
  barcode = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'barcode'
  })
} catch (error) {
  console.log(error)
}

try {
  printlabel = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'printlabel'
  })
} catch (error) {
  console.log(error)
}

try {
  closeport = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'closeport'
  })
} catch (error) {
  console.log(error)
}

try {
  printer_status = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'printerstatus_string'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand_utf8 = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand_utf8'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand_binary = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand_binary'
  })
} catch (error) {
  console.log(error)
}

try {
  windowsfont = edge.func({
    assemblyFile: path,
    typeName: 'TSCSDK.node_usb',
    methodName: 'windowsfont'
  })
} catch (error) {
  console.log(error)
}


process.parentPort.on('message', async (data) => {
  try {
    const datos = data.data.data
    console.log(datos)
    console.log( typeof datos)

    for(const etiqueta of datos){
      console.log("Etiqueta:", etiqueta);
    }

    // Notifica al proceso padre (main)
    process.send && process.send({ ok: true });
  } catch (err) {
    console.log(err)
    process.send && process.send({ error: err.message });
  } finally {
    process.exit(0); // se asegura que muera el hijo
  }
})