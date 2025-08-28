/* eslint-disable prettier/prettier */
const mode = import.meta.env.MODE
let path
if (mode === 'development') {
  path = 'C:\\Users\\SISTEMA\\Documents\\apps\\AplicacionEscritorioCelifrutTypeScript\\tsclibnet.dll';
} else {
  path = './resources/app.asar.unpacked/tsclibnet.dll';

}


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

const label_setup = {
  width: '102',
  height: '24',
  speed: '4',
  density: '8',
  sensor: '0',
  vertical: '4',
  offset: '0'
}



process.parentPort.on('message', async (data) => {
  try {
    const datos = data.data.data

    var label_variable = { quantity: '1', copy: '1' }



    openport('TSC TE200', true)
    setup(label_setup, true)
    clearbuffer('', true)
    let contador = 0;

    for (const etiquetaRaw of datos) {
      for (const item of etiquetaRaw) {
        const etiqueta = toPrinterfontItem(item);
        printerfont(etiqueta, true);
      }
      if (contador > 0) {
        printlabel(label_variable, true)
        clearbuffer('', true)
        contador = 0;
      } else {
          contador += 1;
      }
    }

    printlabel(label_variable, true)
    clearbuffer('', true)

    // Notifica al proceso padre (main)
    console.log("Etiqueta impresa correctamente")
    process.send && process.send({ ok: true });
  } catch (err) {
    console.log(err)
    process.send && process.send({ error: err.message });
  } finally {
    closeport('', true)

    process.exit(0); // se asegura que muera el hijo
  }
})


function toPrinterfontItem(raw) {
  // Si viene como array [x, y, fonttype, rotation, xmul, ymul, text]
  if (Array.isArray(raw)) {
    const [x, y, fonttype, rotation, xmul, ymul, text] = raw;
    return {
      x: String(x ?? ''),
      y: String(y ?? ''),
      fonttype: String(fonttype ?? ''),
      rotation: String(rotation ?? '0'),
      xmul: String(xmul ?? '1'),
      ymul: String(ymul ?? '1'),
      text: String(text ?? ''),
    };
  }

  // Si viene como objeto, forzamos strings y limpiamos espacios
  if (raw && typeof raw === 'object') {
    const norm = {
      x: String(raw.x ?? '').trim(),
      y: String(raw.y ?? '').trim(),
      fonttype: String(raw.fonttype ?? '').trim(),
      rotation: String(raw.rotation ?? '0').trim(),
      xmul: String(raw.xmul ?? '1').trim(),
      ymul: String(raw.ymul ?? '1').trim(),
      text: String(raw.text ?? '').toString(),
    };
    return norm;
  }

  return null; // inválido
}