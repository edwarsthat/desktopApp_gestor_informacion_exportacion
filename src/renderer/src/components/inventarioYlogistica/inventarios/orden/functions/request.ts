/* eslint-disable prettier/prettier */


export const requestVaciar = (lote): object => {
  return {
    inventario: Number(lote.inventario),
    kilosVaciados: lote.inventario * lote.promedio,
    _id: lote._id,
    action: 'put_inventarios_ordenVaceo_vacear',
    __v:lote.__v,
  }
}
