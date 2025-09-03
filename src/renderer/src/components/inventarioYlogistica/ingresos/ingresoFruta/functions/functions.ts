/* eslint-disable prettier/prettier */


interface FormState {
  predio: string
  promedio: number
  numeroPrecintos: string
  numeroRemision: string
  canastillas: number
  kilos: string
  placa: string
  tipoFruta: string
  GGN: string
  fecha_estimada_llegada: string,
  observaciones: string
  ef?: string
}

interface etiquetaType {
  x: string,
  y: string,
  fonttype: string,
  rotation: string,
  xmul: string,
  ymul: string,
  text: string
}

export const crear_request_guardar = (formState): FormState => {
  const canastillas = (Number(formState.canastillasPrestadas) ?? 0) +
    (Number(formState.canastillasPropias) ?? 0)
  return {
    ef: formState.ef,
    predio: formState.nombrePredio,
    promedio: Number(formState.kilos) / Number(canastillas),
    numeroPrecintos: formState.numeroPrecintos,
    numeroRemision: formState.numeroRemision,
    canastillas: canastillas,
    kilos: formState.kilos,
    placa: formState.placa,
    tipoFruta: formState.tipoFruta,
    GGN: formState.GGN,
    fecha_estimada_llegada: formState.fecha_estimada_llegada,
    observaciones: formState.observaciones,
  }
}

export const impresion_etiquetas = (data): etiquetaType[][] => {
  const cantidad = Math.ceil(Number(data.canastillas) / 40);
  let x = 40;
  const sumador = 40;
  const etiquetas: etiquetaType[][] = [];

  for (let i = 0; i < cantidad; i++) {

    console.log("cantidad de canastillas => ", i < cantidad - 1 ? '40' : String(Number(data.canastillas) % 40))
    const estiva = i < cantidad - 1 ? '40' : String(Number(data.canastillas) % 40);
    if(i % 2 === 0){
      x = 40
    } else {
      x = 470
    }

    let y = 40;

    const etiqueta: etiquetaType[] = []
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '2',
      ymul: '2',
      text: data.enf
    });
    y += sumador;
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '2',
      ymul: '2',
      text: "ESTIBA " + String(i + 1)
    });
    y += sumador;
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '2',
      ymul: '2',
      text: estiva + " CANASTILLAS"
    });
    // y += 40;

    etiquetas.push(etiqueta);
  }
  return etiquetas;
}
