/* eslint-disable prettier/prettier */
import {
  app,
  shell,
  BrowserWindow,
  nativeTheme,
  ipcMain,
  utilityProcess,
  net,
  Notification,
  Menu,
  MenuItem,
  dialog,
  MessageBoxOptions,
  BrowserView
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { io } from 'socket.io-client'
// import { clientesServerResponseType } from './types/login'
import updater from 'electron-updater'
import appIcon from "../../build/4.webp?asset"

let theme: 'Dark' | 'Ligth' = 'Ligth'
let cargo = ''
let user = ''
let rol
let permisos = []
let socket2
let loginWindow
let downloadWindow
let mainWindow
let accessToken = '';
let cacheFrutas
let cacheFrutas2

const mode = import.meta.env.MODE

const uri = mode === "development" ?
  import.meta.env.MAIN_VITE_URL_DESARROLLO :
  import.meta.env.MAIN_VITE_URL_PRODUCCION;



updater.autoUpdater.setFeedURL({ url: `${uri}`, provider: 'generic' })
updater.autoUpdater.forceDevUpdateConfig = false
updater.autoUpdater.autoDownload = false
updater.autoUpdater.autoInstallOnAppQuit = false
//#region  create Windows
function createWindow(): void {
  // Create the browser window.
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: false,
    icon: appIcon,

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // const ctxMenu = new Menu()

  // ctxMenu.append(new MenuItem({
  //   label: "🔄 Actualizar",
  //   click: function (): void {
  //     mainWindow.webContents.send('reload', "message")
  //     return;
  //   }
  // }));

  // ctxMenu.append(new MenuItem({
  //   label: "📥 Descargar",
  //   click: function (): void {
  //     mainWindow.webContents.send('Descargar', "Descargar")
  //     return;
  //   }
  // }));


  // mainWindow.webContents.on("context-menu", function (_, params) {
  //   // ctxMenu.popup(params)
  // })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // socket.off('listaEmpaqueInfo')
  // socket.on('listaEmpaqueInfo', (data) => {
  //   console.log(data)
  //   if (data.status === 200) mainWindow.webContents.send('listaEmpaqueInfo', data)
  //   if (cargo === 'auxiliar_lista_de_empaque') {
  //     if (data.imprimir) {
  //       const child = utilityProcess.fork(join(__dirname, 'imprimir.js'))
  //       child.postMessage({
  //         destino: data.dataImpresion.cliente.destino,
  //         codigoCliente: data.dataImpresion.cliente.code,
  //         codigoPredio: data.dataImpresion.proveedor.code,
  //         codigoICA: data.dataImpresion.proveedor.ICA,
  //         codigoGGN: data.dataImpresion.proveedor.GGN,
  //         codigoCoC: undefined,
  //         contenedor: data.dataIngreso.contenedor,
  //         ef1: data.dataIngreso.id,
  //         cliente: data.dataImpresion.cliente.cliente,
  //         clienteID: data.dataImpresion.cliente.clienteID,
  //         telefono: data.dataImpresion.cliente.telefono,
  //         correo: data.dataImpresion.cliente.correo,
  //         cajas: data.dataIngreso.cajas,
  //         tipoFruta: data.dataImpresion.tipoFruta,
  //         tipoCaja: data.dataIngreso.tipoCaja
  //       })
  //       child.stdout?.on('data', (data) => {
  //         console.log(data)
  //       })
  //     } else console.log('error')
  //   }
  // })

  //#region listeners

  socket2.on('status_proceso', (data) => {
    console.log(data)
    mainWindow.webContents.send('status_proceso', data)
  })

  socket2.on('server_event', (data) => {
    mainWindow.webContents.send('server_event', data)

    console.log("nuevo manejador de eventos =>", data.data)

    if (data.action === 'add_lote') {
      if (data.data && data.data.PREDIO) {
        new Notification({
          title: 'Predio Nuevo',
          body: data.data.enf + " - " + data.data.PREDIO
        }).show()
      }
    } else if (data.action === 'vaciar_lote') {
      console.log(data.data)
    }
  })


}

function createLoginWindow(): void {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  loginWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  loginWindow.on('ready-to-show', () => {
    loginWindow.show()
  })

  loginWindow.loadFile(join(__dirname, '../renderer/login.html'))

}

function createDownloadWindow(): void {
  // Create the browser window.
  downloadWindow = new BrowserWindow({
    width: 400,
    height: 200,
    show: false,
    resizable: false,
    autoHideMenuBar: true,

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  downloadWindow.on('ready-to-show', () => {
    downloadWindow.show()
    console.log('Download window is ready to receive messages'); // Para debugging
  })

  // Agregar listener para debugging cuando se cierre
  downloadWindow.on('closed', () => {
    console.log('Download window closed');
    downloadWindow = null;
  })

  downloadWindow.loadFile(join(__dirname, '../renderer/downloadWindow.html'))
}

// Crea el menú específico de la tabla
const ctxMenuTabla = new Menu();
ctxMenuTabla.append(new MenuItem({
  label: "📄 Descargar Excel",
  click: (): void => {
    // Cuando se selecciona, le pides los datos al renderer
    mainWindow.webContents.send('solicitarDatosTabla');
  }
}));

//#region  cuando esta lista la app
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // const tray = new Tray(nativeImage.createFromPath(appIcon))



  if (nativeTheme.shouldUseDarkColors) {
    theme = 'Dark'
  } else {
    theme = 'Ligth'
  }
  nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
      theme = 'Dark'
    } else {
      theme = 'Ligth'
    }
  })



  createLoginWindow()

})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//#region funciones del sistema
//se obtiene el theme del equipo
ipcMain.handle('obtenerTheme', async () => {
  try {
    return theme
  } catch (e: unknown) {
    return `${e}`
  }
})
ipcMain.handle('version', async () => {
  return app.getVersion();
})
ipcMain.handle('obtenerCuenta', async () => {
  try {
    return { user: user, permisos: permisos, cargo: cargo, rol: rol }
  } catch (e: unknown) {
    return `${e}`
  }
})
ipcMain.handle('reporteFallo', async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    icon: appIcon,
    resizable: false,
    maximizable: false
  })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 800, height: 600 })
  view.webContents.loadURL('https://forms.office.com/Pages/ResponsePage.aspx?id=KE_oZH36ZkOQP6vYejM5G-SWkSkw5QdKgoAC2bVgIKlUOEpQRkYzWFdaOFRZQUE5VE1VQjVLWVMyTS4u')
})
ipcMain.handle('sugerenciaMejora', async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: false,
    icon: appIcon,
    resizable: false,
    maximizable: false
  })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 800, height: 600 })
  view.webContents.loadURL('https://forms.office.com/Pages/ResponsePage.aspx?id=KE_oZH36ZkOQP6vYejM5G-SWkSkw5QdKgoAC2bVgIKlUNlRIV1QwN0syT1BQWEtKTVQzQUVVQ1dZUC4u')
})
ipcMain.handle('openExternalLink', async (event, url) => {
  event.preventDefault()
  console.log(url)
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    autoHideMenuBar: false,
    icon: appIcon,
  })

  const view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 900, height: 700 })
  view.webContents.loadURL(url)
})
ipcMain.on('mostrarMenuTabla', () => {
  // Solo aquí muestras el menú contextual personalizado para la tabla
  ctxMenuTabla.popup({ window: mainWindow });
});
ipcMain.on('datosTablaParaExcel', async (_, datosTabla) => {
  // Aquí lanzas el proceso hijo para crear el Excel
  // Ejemplo con utilityProcess o child_process
  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar archivo Excel',
    defaultPath: `data.xlsx`,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  });
  if (!filePath) return; // usuario canceló

  const child = utilityProcess.fork(join(__dirname, 'crearExcel.js'));
  // const request = JSON.stringify({ data: datosTabla, path: filePath, })
  // child.postMessage(request);
  child.postMessage({ data: datosTabla, path: filePath });

  child.on('message', (msg) => {
    if (msg.ok) {
      console.log('Excel creado en:', msg.ruta);
      mainWindow.webContents.send('excelCreado', { ruta: msg.ruta });
    } else {
      console.error('Error al crear el Excel:', msg.error);
      mainWindow.webContents.send('excelError', { error: msg.error });
    }
  });
});

//#region llamadas al servidor
let lastProgress = 0;

updater.autoUpdater.on('download-progress', (progressObj) => {
  const currentProgress = Math.round(progressObj.percent);

  // Solo registra y envía si el progreso ha cambiado
  if (currentProgress !== lastProgress) {
    console.log('Progreso de descarga:', progressObj);
    console.log(`Progreso: ${currentProgress}%`);
    console.log(`Velocidad: ${(progressObj.bytesPerSecond / 1048576).toFixed(2)} MB/s`);
    console.log(`${(progressObj.transferred / 1048576).toFixed(2)} MB de ${(progressObj.total / 1048576).toFixed(2)} MB`);

    // Verificar que downloadWindow existe, no está destruida y que webContents está listo
    if (downloadWindow && !downloadWindow.isDestroyed() && downloadWindow.webContents && !downloadWindow.webContents.isDestroyed()) {
      try {
        downloadWindow.webContents.send('updateProgress', currentProgress);
        console.log(`Progreso enviado a downloadWindow: ${currentProgress}%`);
      } catch (error) {
        console.error('Error enviando progreso:', error);
      }
    } else {
      console.log('downloadWindow no disponible para enviar progreso');
    }
    lastProgress = currentProgress;
  }
});

updater.autoUpdater.on('update-downloaded', async (info) => {
  console.log('Actualización descargada:', info);

  // Aquí puedes mostrar un diálogo al usuario preguntando si quiere reiniciar ahora
  const dialogOpts: MessageBoxOptions = {
    type: 'info',
    buttons: ['Reiniciar', 'Más tarde'],
    title: 'Actualización disponible',
    message: 'Una nueva versión ha sido descargada. Reinicia la aplicación para aplicar las actualizaciones.',
    detail: 'La aplicación se reiniciará para instalar la actualización.'
  };

  const response = await dialog.showMessageBox(mainWindow, dialogOpts);

  if (response.response === 0) {
    updater.autoUpdater.quitAndInstall();
  }
  
  // Cerrar ventana de descarga en ambos casos
  if (downloadWindow && !downloadWindow.isDestroyed()) {
    downloadWindow.close();
  }
});


ipcMain.handle('user2', async (event, datos) => {
  try {
    event.defaultPrevented
    const responseJSON = await net.fetch(mode === 'development' ? `${uri}login2` : `${uri}login2`, {
      // const responseJSON = await net.fetch(mode === 'development' ? `${uri}:3010/login2` : `${uri}login2`, {

      method: "POST",
      headers: {
        'Content-Type': 'application/json' // Añade este encabezado
      },
      body: JSON.stringify({
        user: datos.user,
        password: datos.password
      })
    })
    const response = await responseJSON.json();
    // console.log(response)
    if (response.status === 200) {

      accessToken = response.accesToken;

      socket2 = io(`${uri}`, {
        auth: {
          token: response.accesToken
        },
        rejectUnauthorized: false
      });

      socket2.on('connect', () => {
        electronApp.setAppUserModelId('com.electron')
        const version = app.getVersion()
        console.log(version)
        net
          .fetch(`${uri}/sistema/check_desktopApp/${version}`, { method: 'GET' })
          .then((response) => response.json())
          .then(async (data) => {
            // console.log(data)
            if (data) {
              // updater.autoUpdater.checkForUpdatesAndNotify()
              const check = await updater.autoUpdater.checkForUpdates();
              if (check) {
                const dialogOpts: MessageBoxOptions = {
                  type: 'info',
                  buttons: ['Actualizar', 'Más tarde'],
                  title: 'Actualización disponible',
                  message: `Versión ${check.versionInfo.version} disponible. ¿Desea actualizar ahora?`,
                  detail: 'La aplicación se reiniciará para instalar la actualización.'
                };

                const response = await dialog.showMessageBox(mainWindow, dialogOpts);
                if (response.response === 0) {
                  createDownloadWindow()
                  
                  // Esperar a que la ventana esté completamente cargada antes de iniciar descarga
                  setTimeout(async () => {
                    try {
                      console.log('Iniciando descarga de actualización...');
                      await updater.autoUpdater.downloadUpdate()
                    } catch (error) {
                      console.error('Error al iniciar descarga:', error);
                      if (downloadWindow && !downloadWindow.isDestroyed()) {
                        downloadWindow.close();
                      }
                    }
                  }, 1000);
                }
              }


            }
          })
          .catch((e) => console.log(e))

        updater.autoUpdater.on("error", (info) => {
          console.error('Error en actualización:', info);
          new Notification({
            title: info.name,
            body: info.message
          }).show()
          
          // Cerrar ventana de descarga si hay error
          if (downloadWindow && !downloadWindow.isDestroyed()) {
            downloadWindow.close();
          }
        })
      });



      socket2.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        mainWindow.close()
        createLoginWindow()
      });

      loginWindow.close()
      rol = response.Rol;
      cargo = response.permisos.Cargo;
      user = response.user;
      permisos = response.permisos;

      createWindow()


      const frutaResponse = await net.fetch(`${uri}dataSys/get_data_tipoFruta`, {
        method: 'GET',
        headers: { Authorization: `${accessToken}` }
      })

      const frutasResponse = await frutaResponse.json();
      cacheFrutas = frutasResponse.data

      const frutaResponse2 = await net.fetch(`${uri}dataSys/get_data_tipoFruta2`, {
        method: 'GET',
        headers: { Authorization: `${accessToken}` }
      })

      const frutasResponse2 = await frutaResponse2.json();
      cacheFrutas2 = frutasResponse2.data
      console.log("cacheFrutas2", cacheFrutas2)
      return response
    }
    return response
  } catch (e) {
    if (e instanceof Error) {
      console.log(e)
      return `${e.message}`

    }
  }
})

//comunicacion con el servidor
ipcMain.handle('server2', async (event, data) => {
  try {

    event.preventDefault()
    const request = { data: data, token: accessToken }
    const response: { status: number, data: object, token: string } = await new Promise((resolve) => {
      socket2.emit('Desktop2', request, (serverResponse) => {
        if (serverResponse.status === 404) {
          mainWindow.close()
          createLoginWindow()
        }
        resolve(serverResponse)
      })
    })
    return response
  } catch (e) {
    return { status: 505, data: e }
  }
})

ipcMain.handle('forgotPassword', async (event, data) => {
  try {
    event.defaultPrevented
    console.log("forgot pass", data)
    const responseJSON = await net.fetch(`${uri}password`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: data.user
      })
    })
    const response = await responseJSON.json();
    return response
  } catch (e) {
    return { status: 505, data: e }
  }
})

ipcMain.handle("imprimirEtiqueta", async (event, data) => {
  try {
    event.preventDefault()
    const child = utilityProcess.fork(join(__dirname, 'imprimirEtiqueta.js'));
    child.postMessage({ data });

    child.on('message', (msg) => {
      if (msg.ok) {
        console.log('Imprimiendo...:', msg.ruta);
        mainWindow.webContents.send('Imprimiendo', { ruta: msg.ruta });
      } else {
        console.error('Error al imprimir:', msg.error);
        mainWindow.webContents.send('Error al imprimir', { error: msg.error });
      }
    });
    return true
  } catch (e) {
    console.error(e)
    return false
  }
})

// ipcMain.handle('imprimirRotulos', async (event, data) => {
//   try {
//     event.preventDefault()
//     console.log(data)
//     if (data.tipoRotulo === 'rotuloCaja') {
//       console.log('entra aqui')
//       const request = {
//         data: {
//           action: 'obtenerInfoRotulosCajas',
//           data: { cliente: data.cliente, nombrePredio: data.nombrePredio, enf: data.enf }
//         },
//         id: socket.id
//       }
//       const response: clientesServerResponseType = await new Promise((resolve) => {
//         socket.emit('contenedoresService', request, (serverResponse) => {
//           if (typeof serverResponse === 'object') {
//             resolve(serverResponse)
//           }
//         })
//       })

//       if (cargo === 'auxiliar_lista_de_empaque') {
//         const child = utilityProcess.fork(join(__dirname, 'imprimir.js'))
//         child.postMessage({
//           destino: response.data.cliente.PAIS_DESTINO,
//           codigoCliente: response.data.cliente.CODIGO,
//           codigoPredio: response.data.proveedor['CODIGO INTERNO'],
//           codigoICA: response.data.proveedor.ICA,
//           codigoGGN: response.data.proveedor.GGN,
//           codigoCoC: undefined,
//           contenedor: data.contenedor,
//           ef1: response.data.lote._id,
//           cliente: response.data.cliente.CLIENTE,
//           clienteID: response.data.cliente.ID,
//           telefono: response.data.cliente.TELEFONO,
//           correo: response.data.cliente.CORREO,
//           cajas: data.cajas,
//           tipoFruta: response.data.lote.tipoFruta,
//           tipoCaja: data.tipoCaja
//         })
//         child.stdout?.on('data', (data) => {
//           console.log(data)
//         })
//       }
//     } else if (data.tipoRotulo === 'rotuloPallet') {
//       console.log(data)
//       if (cargo === 'auxiliar_lista_de_empaque') {
//         const child = utilityProcess.fork(join(__dirname, 'imprimirPallet.js'))
//         child.postMessage({
//           pallet: data.pallet
//         })
//         child.stdout?.on('data', (data) => {
//           console.log(data)
//         })
//       }
//     }
//   } catch (e) {
//     console.error(e)
//   }
// })

const saveFile = async (defaultFileName): Promise<string> => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar archivo Excel',
    defaultPath: defaultFileName,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  });
  return filePath;
};

ipcMain.handle('crearDocumento', async (event, data) => {
  event.preventDefault()
  if (data.action === 'crear_resporte_predios_lista_empaque' || data.action === "crear_lista_empaque") {
    const cont = data.data.contenedor
    const { filePath } = await dialog.showSaveDialog({
      title: 'Guardar archivo Excel',
      defaultPath: `${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    });

    const child = utilityProcess.fork(join(__dirname, 'crearDocumentos.js'));
    // Enviar el action junto con el data y filePath
    const request = JSON.stringify({ data: data.data, path: filePath, action: data.action, tiposFrutas: data.tiposFrutas })
    child.postMessage(request);
  } else if (data.action === "crear_documentos_programacon_mula") {

    const cont = data.data.contenedor

    const child = utilityProcess.fork(join(__dirname, 'crearDocumentos.js'));

    // Primer archivo
    const filePath1 = await saveFile(`${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE} - reporte vehiculo.xlsx`);
    let request = JSON.stringify({ data: data.data, path: filePath1, action: "crear_documentos_programacon_mula_reporte_vehiculo" });
    child.postMessage(request);

    // Segundo archivo
    const filePath2 = await saveFile(`${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE} - datalogger.xlsx`);
    request = JSON.stringify({ data: data.data, path: filePath2, action: "crear_documentos_programacon_mula_reporte_data_logger" });
    child.postMessage(request);

    // tercer archivo
    const filePath3 = await saveFile(`${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE} - Carga e Instrucciones Manejo.docx`);
    request = JSON.stringify({ data: data.data, path: filePath3, action: "crear_documentos_programacon_mula_reporte_instrucciones_manejo" });
    child.postMessage(request);

    // cuarto archivo
    const filePath4 = await saveFile(`${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE} - Carta de responsabilidad.docx`);
    request = JSON.stringify({ data: data.data, path: filePath4, action: "crear_documentos_programacon_mula_carta_responsabilidad" });
    child.postMessage(request);

    // quinto archivo
    // const filePath5 = await saveFile(`${cont.numeroContenedor} - ${cont.infoContenedor.clienteInfo.CLIENTE} - Check list.xlsx`);
    // request = JSON.stringify({ data: data.data, path: filePath5, action: "crear_check_list_transporte" });
    // child.postMessage(request);


    // Escucha el cierre del proceso hijo
    child.on('exit', (code) => {
      console.log(`El proceso hijo terminó con código: ${code}`);
    });
  }


})

ipcMain.handle("cerrarSesion", async () => {
  accessToken = '';
  socket2.disconnect();
  mainWindow.close();
  createLoginWindow()
})

ipcMain.handle("obtenerFruta", async () => {
  return cacheFrutas
})

ipcMain.handle("obtenerFruta2", async () => {
  return cacheFrutas2
})