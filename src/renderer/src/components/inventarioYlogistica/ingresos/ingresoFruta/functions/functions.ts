/* eslint-disable prettier/prettier */


interface FormState {
  predio: string
  promedio: number
  numeroPrecintos: string
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
  let y = 40;
  let x = 20;
  const etiquetas: etiquetaType[][] = [];

  for (let i = 0; i < cantidad; i++) {
    const etiqueta: etiquetaType[] = []
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '1',
      ymul: '1',
      text: data.enf
    });
    y += 40;
    x = 40;
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '1',
      ymul: '1',
      text: String(i + 1)
    });
    y += 40;
    x = 20;
    etiqueta.push({
      x: String(x),
      y: String(y),
      fonttype: '1',
      rotation: '0',
      xmul: '1',
      ymul: '1',
      text: i === cantidad - 1 ? '40' : String(Number(data.canastillas) % 40)
    });
    y += 40;

   etiquetas.push(etiqueta);
  }
  return etiquetas;
}
