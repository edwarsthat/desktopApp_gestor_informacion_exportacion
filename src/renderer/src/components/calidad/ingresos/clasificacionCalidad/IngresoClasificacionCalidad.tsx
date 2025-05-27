/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'

import { lotesType } from '@renderer/types/lotesType';
import useAppContext from '@renderer/hooks/useAppContext';
import NavClasificacionCalidad from './utils/NavClasificacionCalidad';
import './css/styles.css';
import IngresoDatos from './components/IngresoDatos';
import { elementoDefectoType } from './types/clasificacionTypes';
import ShowData from './components/ShowData';
import ConfirmacionModal from '@renderer/messages/ConfirmacionModal';
import useDataIngresoClasificacion from './hooks/useDataIngresoClasificacion';
import useGetSysData from '@renderer/hooks/useGetSysData';
import { calcular_porcentage } from './functions/functions';
import { validateRequest } from './validations/validationsRequest';
import { useConfirm } from '@renderer/hooks/useModalConfimartion';

export default function IngresoClasificacionCalidad(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer, setLoading, loading } = useAppContext();
  const { obtenerData, lotesData } = useDataIngresoClasificacion();
  const { obtenerDefectos, dataDefectos } = useGetSysData({});

  const {
    setShowConfirmation, showConfirmation,
    message, setMessage,
    setConfirm, requestConfirm
  } = useConfirm();

  const [lote, setLote] = useState<lotesType>()
  const [dataArray, setDataArray] = useState<elementoDefectoType[]>([])

  //modal para confirmar
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        await obtenerData();
        await obtenerDefectos();
      } catch (err) {
        if (err instanceof Error) {
          console.log(err)
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (eventoServidor === 'add_lote') {
      obtenerData()
    }
  }, [triggerServer])

  const guardar = async (): Promise<void> => {
    try {
      setLoading(true);
      if (!lote?._id) throw new Error("Error, seleccione un lote")
      setMessage("¿Seguro desea guardar los datos?")

      //  Calculamos la suma total de 'lavado + encerado'
      const total = dataArray.reduce((acu, item) => acu + item.lavado + item.encerado, 0);
      if (total === 0) {
        throw new Error('No hay defectos agregados');
      }
      //calcular los porcentages
      const roundedPorcentages = calcular_porcentage(dataArray, total);

      const dataObject = roundedPorcentages.reduce((acu, item) => {
        acu[`calidad.clasificacionCalidad.${item.defecto}`] = item.porcentage;
        return acu;
      }, {} as Record<string, number>);

      const request = {
        action: 'put_calidad_ingresos_clasificacionDescarte',
        data: dataObject,
        _id: lote._id,
        __v: lote.__v
      }
      validateRequest(request);
      const response = await window.api.server2(request);
      if (response.status !== 200) {
        throw new Error(`${response.message}`);
      }
      messageModal("success", "Datos guardados con exito!");
      setDataArray([]);
      await obtenerData()

    } catch (err) {
      if (err instanceof Error) {
        messageModal('error', `${err.message}`);
      }
    } finally {
      setShowConfirmation(false);
      setLoading(false);
    }
  }

  const eliminarItem = (index: number): void => {
    setDataArray(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1); // Eliminar el elemento en el índice especificado
      return newArray;
    })
  }
  return (
    <div className='componentContainer'>
      <NavClasificacionCalidad lotesData={lotesData} setLote={setLote} />
      <h2>Ingreso clasificación descarte</h2>
      <hr />
      <div className='container-clasificacion-calidad-formulario'>
        <div className='container-clasificacion-calidad-formulario-div'>
          <IngresoDatos setDataArray={setDataArray} dataArray={dataArray} dataDefectos={dataDefectos} />
          <button
            disabled={loading}
            className='defaulButtonAgree'
            onClick={(): void => requestConfirm(guardar, "¿Seguro desea guardar los datos?")}>
            Guardar
          </button>
        </div>
        <ShowData dataArray={dataArray} eliminarItem={eliminarItem} dataDefectos={dataDefectos} />
      </div>
      {showConfirmation &&
        <ConfirmacionModal
          message={message}
          setConfirmation={setConfirm}
          setShowConfirmationModal={setShowConfirmation}
        />}

    </div>
  )
}
