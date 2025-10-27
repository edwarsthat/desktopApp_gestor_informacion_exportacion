/* eslint-disable prettier/prettier */

import { contenedoresType, palletType } from "@renderer/types/contenedoresType";


export function generateMockContenedor(overrides = {}): contenedoresType {
    const randomInt = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const randomPick = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];

    const frutas = ["Limon", "Naranja", "Mandarina", "Pomelo"];
    const cajas = ["B-16.5", "G-13", "B-15", "G-16"];
    const calidades = ["1", "1.5", "2"];
    const calibres = ["72", "100", "110", "150", "175", "200", "230", "250"];

    const numero = randomInt(1000, 9999);


    // genera un array de N elementos
    const generateArray = (length: number, generatorFn): palletType[] =>
        Array.from({ length }, generatorFn);

    // Número random de pallets entre 5 y 50
    const numPallets = randomInt(5, 50);

    const pallets = generateArray(numPallets, () => {
        const numEF1 = randomInt(2, 10);
        return {
            settings: {
                tipoCaja: randomPick(cajas),
                calidad: randomPick(calidades),
                calibre: randomPick(calibres)
            },
            EF1: generateArray(numEF1, () => ({
                _id: `mock_ef1_${randomInt(1, 9999)}`,
                lote: {
                    enf: `ENF-${randomInt(1, 100)}`,
                    predio: `Predio ${randomInt(1, 50)}`,
                    _id: `mock_lote_id_${randomInt(1, 9999)}`,
                    ICA: {
                        code: `ICA-${randomInt(1000, 9999)}`,
                        fechaVencimiento: String(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
                    },
                    GGN: {
                        code: `GGN-${randomInt(1000, 9999)}`,
                        fechaVencimiento: String(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
                        paises: ["Colombia", "USA"],
                        tipo_fruta: [randomPick(frutas)]
                    },
                    VENCIMIENTO: String(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
                    predioID: `predio_${randomInt(1, 100)}`,
                    SISPAP: Math.random() < 0.8
                },
                cajas: randomInt(1, 100),
                tipoCaja: randomPick(cajas),
                calibre: randomPick(calibres),
                calidad: randomPick(calidades),
                fecha: String(new Date()),
                tipoFruta: randomPick(frutas),
                SISPAP: Math.random() < 0.8,
                GGN: Math.random() < 0.5
            })),
            cajasTotal: randomInt(100, 500),
            listaLiberarPallet: {
                rotulado: Math.random() < 0.5,
                paletizado: Math.random() < 0.5,
                enzunchado: Math.random() < 0.5,
                estadoCajas: Math.random() < 0.5,
                estiba: Math.random() < 0.5
            }
        };
    });

    const contenedor = {
        _id: `mock_id_${randomInt(1, 9999)}`,
        numeroContenedor: numero,
        pallets: pallets,
        infoContenedor: {
            clienteInfo: {
                _id: `mock_cliente_id_${randomInt(1, 100)}`,
                CLIENTE: `Cliente Mock ${randomInt(1, 100)}`,
                PAIS_DESTINO: ["USA", "Europa"],
                CODIGO: randomInt(1000, 9999),
                CORREO: `cliente${randomInt(1, 100)}@mock.com`,
                DIRECCIÓN: `Calle Mock ${randomInt(1, 100)}`,
                ID: `ID-${randomInt(1000, 9999)}`,
                TELEFONO: `+57 30012345${randomInt(1, 9)}`,
                activo: true
            },
            fechaCreacion: String(new Date()),
            fechaInicio: String(new Date()),
            fechaInicioReal: String(new Date()),
            fechaFinalizado: "",
            fechaEstimadaCargue: String(new Date()),
            fechaSalida: "",
            ultimaModificacion: String(new Date()),
            tipoFruta: [{
                _id: `mock_tipo_fruta_${randomInt(1, 100)}`,
                tipoFruta: randomPick(frutas),
                valorPromedio: randomInt(10, 50),
                defectos: ["Defecto1", "Defecto2"],
                rengoDeshidratacionPositiva: 5,
                rengoDeshidratacionNegativa: -5,
                createdAt: String(new Date()),
                calibres: [randomPick(calibres), randomPick(calibres)],
                codNacional: `CN-${randomInt(100, 999)}`,
                codExportacion: `CE-${randomInt(100, 999)}`
            }],
            tipoCaja: [randomPick(cajas)],
            calidad: [{
                _id: `mock_calidad_${randomInt(1, 100)}`,
                nombre: randomPick(calidades),
                descripcion: `Descripción calidad ${randomPick(calidades)}`,
                importancia: randomInt(1, 5),
                codContabilidad: `COD-${randomInt(100, 999)}`,
                tipoFruta: {
                    _id: `mock_tipo_fruta_${randomInt(1, 100)}`,
                    tipoFruta: randomPick(frutas),
                    valorPromedio: randomInt(10, 50),
                    defectos: ["Defecto1", "Defecto2"],
                    rengoDeshidratacionPositiva: 5,
                    rengoDeshidratacionNegativa: -5,
                    createdAt: String(new Date()),
                    calibres: [randomPick(calibres)],
                    codNacional: `CN-${randomInt(100, 999)}`,
                    codExportacion: `CE-${randomInt(100, 999)}`
                }
            }],
            sombra: `${randomInt(0, 100)}% `,
            defecto: `${randomInt(0, 10)}% `,
            mancha: "N/A",
            verdeManzana: "N/A",
            cerrado: false,
            observaciones: `Observación aleatoria ${randomInt(1, 999)} `,
            desverdizado: Math.random() < 0.3,
            calibres: [randomPick(calibres), randomPick(calibres)],
            urlInforme: "",
            cajasTotal: String(randomInt(50, 1500)),
            rtoEstimado: `${randomInt(100, 2000)} USD`
        },
        infoTractoMula: {
            transportadora: `MockTransportes_${randomInt(1, 100)} `,
            nit: `9001234${randomInt(1, 100)} `,
            placa: `ABC${randomInt(100, 999)} `,
            trailer: `TRL${randomInt(100, 999)} `,
            conductor: `Conductor ${randomInt(1, 100)} `,
            cedula: `1234567${randomInt(1, 9)} `,
            celular: `30012345${randomInt(1, 9)} `,
            temperatura: "5°C",
            precinto: `PRE${randomInt(100, 999)} `,
            datalogger_id: `DL${randomInt(100, 999)} `,
            flete: 150000 + randomInt(0, 50000),
            marca: "MockMarca",
            fecha: String(new Date())
        },
        infoExportacion: {
            puerto: "Cartagena",
            naviera: `MockNaviera_${randomInt(1, 100)} `,
            agencia: `MockAgencia_${randomInt(1, 100)} `,
            expt: `EXP${randomInt(1000, 9999)} `,
            fecha: String(new Date())
        },
        insumosData: {
            any: new Map([
                ["plastico", randomInt(10, 100)],
                ["carton", randomInt(10, 100)],
                ["etiquetas", randomInt(10, 100)]
            ]),
            flagInsumos: Math.random() < 0.7
        },
        inspeccion_mula: {
            funcionamiento: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            temperatura: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            talanquera: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            dannos: { cumple: Math.random() < 0.5, observaciones: "Rasguño leve" },
            sellos_puertas: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            materiales: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            reparaciones: { cumple: Math.random() < 0.5, observaciones: "Pendiente" },
            limpio: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            plagas: { cumple: Math.random() < 0.9, observaciones: "Sin plagas" },
            olores: { cumple: Math.random() < 0.9, observaciones: "Sin olores" },
            insumos: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            medidas: { cumple: Math.random() < 0.9, observaciones: "Ok" },
            fecha: String(new Date()),
            usuario: `mock_usuario_${randomInt(1, 100)} `
        },
        reclamacionCalidad: {
            responsable: `Responsable ${randomInt(1, 100)} `,
            Cargo: "Inspector",
            telefono: `30112345${randomInt(1, 9)} `,
            cliente: `Cliente Mock ${randomInt(1, 100)} `,
            fechaArribo: "2025-05-25",
            contenedor: `${numero} `,
            correo: `cliente${randomInt(1, 100)} @mock.com`,
            kilos: randomInt(1000, 3000),
            cajas: randomInt(50, 150),
            fechaDeteccion: String(new Date()),
            moho_encontrado: `${randomInt(0, 10)} `,
            moho_permitido: "2",
            golpes_encontrado: `${randomInt(0, 5)} `,
            golpes_permitido: "0",
            frio_encontrado: `${randomInt(0, 5)} `,
            frio_permitido: "0",
            maduracion_encontrado: `${randomInt(0, 5)} `,
            maduracion_permitido: "1",
            otroDefecto: "Ninguno",
            observaciones: `Observación de calidad ${randomInt(1, 999)} `,
            archivosSubidos: [`file${randomInt(1, 10)} _1.jpg`, `file${randomInt(1, 10)} _2.jpg`],
            fecha: String(new Date())
        },
        registrosSalidas: []
    };

    return { ...contenedor, ...overrides };
}
