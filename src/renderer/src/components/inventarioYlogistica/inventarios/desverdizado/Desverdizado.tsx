/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from 'react'
import { lotesType } from "@renderer/types/lotesType";
import TablaInventarioDesverdizado from "./components/TablaInventarioDesverdizado";
import BotonesDesverdizado from "./components/BotonesDesverdizado";
import ModalParametros from "./components/ModalParametros";
import "@renderer/css/dialog-style.css"
import { useDataInventarioDesverdizado } from "./hooks/useDataInventarioDesverdizado";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";
import "./css/style.css"


export default function Desverdizado(): JSX.Element {
  const { eventoServidor, triggerServer } = useAppContext();
  const { setCurrentFilters, currentFilters } = useFiltroValue();
  const { obtenerFruta, data } = useDataInventarioDesverdizado(currentFilters);
  const [select, setSelect] = useState<lotesType>()

  useEffect(() => {
    obtenerFruta()
  }, [])


  useEffect(() => {
    if (
      eventoServidor === 'enviar_desverdizado' ||
      eventoServidor === 'vaciar_lote') {
      obtenerFruta()
    }
  }, [triggerServer])


  const handleSelect = (lote: lotesType): void => {
    setSelect(lote)
  }

  return (
    <div className='componentContainer'>
      <div className="navBar"></div>
      <h2>Fruta desverdizando</h2>
      <hr />

      <Filtros 
        showGGN={true}
        ggnId="desverdizado"
        showBuscar={true}
        onFiltersChange={setCurrentFilters} />

      <ModalParametros select={select} />

      <BotonesDesverdizado
        select={select}
        data={data}
      />

      <TablaInventarioDesverdizado
        handleSelect={handleSelect}
        data={data} />
    </div>
  )
}

