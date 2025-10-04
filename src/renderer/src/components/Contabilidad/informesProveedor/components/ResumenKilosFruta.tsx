/* eslint-disable prettier/prettier */

import { descarte_nopago, descarte_pagos } from "@renderer/functions/informesLotes"
import useTipoFrutaStore from "@renderer/store/useTipoFrutaStore"
import { contenedoresType } from "@renderer/types/contenedoresType"
import { lotesType } from "@renderer/types/lotesType"
import React from "react"

type propsType = {
    lote: lotesType
    contenedores: contenedoresType[]

}

export default function ResumenKilosFruta({ lote, contenedores }: propsType): JSX.Element {
    const tiposFruta = useTipoFrutaStore(state => state.tiposFruta)
    // useEffect(() => { console.log(props.lote) }, [])
    const sumardescartes_pagos = (): JSX.Element => {

        const total = descarte_pagos(lote)

        return (
            <tr>
                <td>
                    {lote.tipoFruta.codNacional}
                </td>
                <td>
                    {total.toFixed(2)}
                </td>
                <td>
                    {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(lote.precio.descarte)}

                </td>
                <td>
                    {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(lote.precio.descarte * total)}

                </td>
            </tr>
        )
    }

    const sumardescartes_nopagos = (): JSX.Element => {

        const total = descarte_nopago(lote)

        return (
            <tr>
                <td>
                    No pagos
                </td>
                <td>
                    {total}
                </td>
                <td>
                    $0
                </td>
                <td>
                    $0
                </td>
            </tr>
        )
    }


    const balin_nopago = (): JSX.Element => {


        return (
            <tr>
                <td>
                    No pagos
                </td>
                <td>
                    {
                        (lote.descarteLavado?.balin ?? 0) +
                        (lote.descarteEncerado?.balin ?? 0)
                    }
                </td>
                <td>
                    $0
                </td>
                <td>
                    $0
                </td>
            </tr>
        )
    }

    const guardar_data_clipboard = async (): Promise<void> => {
        // Helper to ensure numbers come out with comma decimal
        const decimalToComma = (num: number): string => {
            // Adjust precision if needed, here we use 2 decimals as an example
            if (typeof num !== 'number') return num
            return num.toFixed(2).replace('.', '.');
        };
        let textCopy = ''
        // Build up your lines
        if (lote.exportacion) {
            const textCopyArrCont = Object.entries(lote.exportacion ?? {}).map(
                ([key, value]) => {
                    const contenedor = contenedores.find(item => item._id === key);
                    if (!contenedor) return [];
                    return Object.entries(value as Record<string, unknown>).map(
                        ([keyCalidad, valueCalidad]) => {

                            const kilos = decimalToComma(valueCalidad as number);
                            const precioKey = decimalToComma(lote.precio.exportacion[keyCalidad]);
                            const subTotal = decimalToComma(
                                lote.precio.exportacion[keyCalidad] * (valueCalidad as number)
                            );
                            const fruta = tiposFruta.find(item => item.calidades.find(calidad => calidad._id === keyCalidad));
                            const cod = fruta ? fruta.calidades.find(calidad => calidad._id === keyCalidad)?.codContabilidad : 'N/A';

                            return (
                                `2\t${cod}\tKg\t${kilos}\t${precioKey}\t\t${subTotal}\t\t\t\t\t\t\tPCONT${contenedor.numeroContenedor}\n`
                            );

                        }
                    );
                }
            );

            const textCopyCont = textCopyArrCont.map(item => item.filter(item2 => item2 !== undefined));

            textCopy = textCopyCont.reduce((acu, item) => (acu += item.join('')), '');
        }
        let total = descarte_pagos(lote);

        if (lote.flag_balin_free) {
            total -= (lote.descarteEncerado?.balin ?? 0) + (lote.descarteLavado?.balin ?? 0)
        }

        const totalNoPago = descarte_nopago(lote); // number

        // Líneas adicionales
        const frutaNacional = lote.frutaNacional
        if (frutaNacional) {
            textCopy +=
                `1\t${lote.tipoFruta.codNacional}\tKilos\t${decimalToComma(frutaNacional)}\t${decimalToComma(lote.precio.frutaNacional)}\t\t${decimalToComma(lote.precio.frutaNacional * frutaNacional)}\n`;
        }

        const directoNacional = lote.directoNacional

        if (directoNacional) {
            textCopy +=
                `1\t${lote.tipoFruta.codNacional}\tKilos\t${decimalToComma(directoNacional)}\t${decimalToComma(lote.precio.frutaNacional)}\t\t${decimalToComma(lote.precio.frutaNacional * directoNacional)}\n`;
        }


        textCopy +=
            `1\t${lote.tipoFruta.codNacional}\tKilos\t${decimalToComma(total)}\t${decimalToComma(lote.precio.descarte)}\t\t${decimalToComma(lote.precio.descarte * total)}\n`;

        const balinTotal = (lote.descarteLavado?.balin ?? 0) + (lote.descarteEncerado?.balin ?? 0);
        textCopy +=
            `1\t${lote.tipoFruta.codNacional}\tKilos\t${decimalToComma(balinTotal)}\t${decimalToComma(0)}\t\t${decimalToComma(0)}\n`;

        textCopy +=
            `1\tMPL1\tKilos\t${decimalToComma(totalNoPago)}\t${decimalToComma(0)}\t\t${decimalToComma(0)}\n`;

        // Finally, copy to clipboard
        if (textCopy) {
            await navigator.clipboard.writeText(textCopy);
        }
    };

    return (
        <div className="container-informe-calidad-lote" >
            <h2>Resumen kilos fruta</h2>
            <hr />
            <button onClick={guardar_data_clipboard} className="defaulButtonAgree">Copiar</button>
            <h3>Exportación</h3>

            <table className="table-main-informe-proveedor">
                <thead>
                    <tr>
                        <th>Contenedor</th>
                        <th>Tipo fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio Total</th>
                    </tr>
                </thead>
                <tbody>
                    {lote.exportacion && Object.entries(lote.exportacion).map(([key, value], index) => {
                        const contenedor = contenedores.find(item => item._id === key);
                        return Object.entries(value).map(([keyCalidad, valueCalidad]) => {
                            if (contenedor && keyCalidad !== '_id') {

                                const fruta = tiposFruta.find(item => item.calidades.find(calidad => calidad._id === keyCalidad));
                                const cod = fruta ? fruta.calidades.find(calidad => calidad._id === keyCalidad)?.codContabilidad : 'N/A';

                                return (
                                    <tr key={`${key}-${keyCalidad}`} className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`}>
                                        <td>{contenedor.numeroContenedor}</td>
                                        <td>{cod}</td>
                                        <td>{valueCalidad as React.ReactNode}</td>
                                        <td>{new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(lote.precio.exportacion[keyCalidad])}</td>
                                        <td>
                                            {new Intl.NumberFormat('es-CO', {
                                                style: 'currency',
                                                currency: 'COP',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(lote.precio.exportacion[keyCalidad] * (valueCalidad as number))}
                                        </td>
                                    </tr>
                                );
                            } else {
                                return null
                            }
                        });
                    })}
                </tbody>

            </table>
            <h3>Fruta nacional</h3>
            <table className="table-main-informe-proveedor">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Tipo de fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={`fondo-par`}>
                        <td>Directo nacional</td>
                        <td>{lote.tipoFruta.codNacional}</td>

                        <td>{lote.directoNacional.toFixed(2)}</td>
                        <td>{new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(lote.precio.frutaNacional)}</td>
                        <td>
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(lote.precio.frutaNacional * lote.directoNacional)}
                        </td>
                    </tr>
                    <tr className={`fondo-impar`}>
                        <td>Fruta nacional</td>
                        <td>{lote.tipoFruta.codNacional}</td>
                        <td>{lote.frutaNacional?.toFixed(2) ?? '0'}</td>
                        <td>{new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(lote.precio.frutaNacional)}</td>
                        <td>
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(lote.precio.frutaNacional * (lote.frutaNacional ?? 0))}
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Descartes</h3>

            <table className="table-main-informe-proveedor">
                <thead>
                    <tr>
                        <th>Tipo de fruta</th>
                        <th>Kilos</th>
                        <th>Precio</th>
                        <th>Precio total</th>
                    </tr>
                </thead>
                <tbody>
                    {sumardescartes_pagos()}
                    {balin_nopago()}
                    {sumardescartes_nopagos()}
                </tbody>
            </table>
        </div>
    )
}
