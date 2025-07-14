/* eslint-disable prettier/prettier */

export const request_guardar_cambios = (lote, formData): object => {
    const promedio = Number(formData.kilos) / Number(formData.canastillas);
    const data = {}
    Object.keys(formData).forEach(item => {

        if (item === 'predio') {
            if (formData[item] !== lote.documento[item]._id) {
                data[item] = formData[item]
            }
        } else if (item === "kilos") {
            if (Number(formData[item]) !== lote.documento[item]) {
                data[item] = Number(formData[item])
            }
        } else if (item === "canastillas") {
            if (Number(formData[item]) !== lote.documento[item]) {
                data[item] = Number(formData[item])
            }
        } else if (item === "GGN") {
            if (Number(formData[item]) !== lote.documento[item]) {
                data[item] = formData[item] === 'true' ? true : false
            }
        }
        else {
            if (formData[item] !== lote.documento[item]) {
                data[item] = formData[item]
            }
        }
    })
    return {
        action: 'put_inventarios_historiales_ingresoFruta_modificar',
        _idLote: lote.documento._id,
        _idRecord: lote._id,
        __v: lote.__v,
        type: "loteEF1",
        data: {
            ...data,
            promedio: promedio,
        }
    }
}