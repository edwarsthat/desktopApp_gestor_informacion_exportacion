/* eslint-disable prettier/prettier */

import { AuditLog, Change } from '../types'
import '../styles/CardRegistro.css'
import { actionsRegistros } from '../utils/actions'
import useTipoFrutaStore from '@renderer/store/useTipoFrutaStore'

type propsType = {
    registro: AuditLog
}

export default function CardRegistro({ registro }: propsType): JSX.Element {
    const calidadesArr = useTipoFrutaStore(state => state.tiposCalidades)
    const calidadesMap = calidadesArr.reduce((map, calidad) => {
        map[calidad._id] = calidad.nombre
        return map
    }, {} as Record<string, string>)


    const renderChange = (change: Change): JSX.Element => {
        let before = ''
        let after = ''
        let campo = change.field
        if (change) {
            if (change.field.startsWith("exportacion")) {
                if (typeof change.after === 'number') {
                    const calidadId = change.field.split('.')[2]
                    const calidadNombre = calidadesMap[calidadId] || calidadId
                    campo = `Exportacion calidad ${calidadNombre}`
                } else if(typeof change.after === 'object') {
                    Object.keys(change.after || {}).forEach(key => {
                        if(calidadesMap[key]) {
                            campo = `Exportacion calidad ${calidadesMap[key]}`
                        }
                    })
                }
            } 
        }
        after = JSON.stringify(change.after)
        before = JSON.stringify(change.before)

        return (
            <div className="change" key={change.field}>
                <span className="changeField">{campo}:</span>{' '}
                <span className="changeValues">{before}</span> {'->'}{' '}
                <span className="changeValues">{after}</span>
            </div>
        )
    }

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (registro.operation === 'create') {
        return (
            <div className="card">
                <div className="header">
                    <h3 className="action">{actionsRegistros?.[registro.action] || registro.action}</h3>
                    <span className={`operation operation_${registro.operation.toUpperCase()}`}>
                        {registro.operation}
                    </span>
                </div>
                {registro.description && <p className="description">{registro.description}</p>}
                <div className="meta">
                    <span className="user">Usuario: {registro.user}</span>
                    <span className="timestamp">{formatDate(registro.timestamp)}</span>
                </div>
                {registro.newValue && typeof registro.newValue === 'object' && (
                    <div className="changesContainer">
                        <h4 className="changesTitle">Datos Creados:</h4>
                        {'kilos' in registro.newValue && (
                            <div className="change">
                                <span className="changeField">Kilos:</span>{' '}
                                <span className="changeValues">{(registro.newValue as { kilos: number }).kilos} Kg</span>
                            </div>
                        )}
                        {'canastillas' in registro.newValue && (
                            <div className="change">
                                <span className="changeField">Canastillas:</span>{' '}
                                <span className="changeValues">{(registro.newValue as { canastillas: number }).canastillas}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="card">
            <div className="header">
                <h3 className="action">{actionsRegistros?.[registro.action] || registro.action}</h3>
                <span className={`operation operation_${registro.operation.toUpperCase()}`}>
                    {registro.operation}
                </span>
            </div>
            {registro.description && <p className="description">{registro.description}</p>}
            <div className="meta">
                <span className="user">Usuario: {registro.user}</span>
                <span className="timestamp">{formatDate(registro.timestamp)}</span>
            </div>
            {registro.changes && registro.changes.length > 0 && (
                <div className="changesContainer">
                    <h4 className="changesTitle">Cambios: {registro.changes.map(renderChange)}</h4>
                </div>
            )}
        </div>
    )
}