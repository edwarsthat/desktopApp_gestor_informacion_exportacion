/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from 'react'
import TablaInventarioDesverdizado from "./components/TablaInventarioDesverdizado";
import BotonesDesverdizado from "./components/BotonesDesverdizado";
import ModalParametros from "./components/ModalParametros";
import "@renderer/css/dialog-style.css"
import { useDataInventarioDesverdizado } from "./hooks/useDataInventarioDesverdizado";
import Filtros from "@renderer/components/UI/components/Filtros";
import { useFiltroValue } from "@renderer/hooks/useFiltro";
import "./css/style.css"
import { itemInventarioType } from "./validations/types";
import ModalMoverFruta from "./components/ModalMoverFruta";


export default function Desverdizado(): JSX.Element {
  const { eventoServidor, triggerServer } = useAppContext();
  const { setCurrentFilters, currentFilters } = useFiltroValue();
  const { obtenerFruta, data } = useDataInventarioDesverdizado(currentFilters);
  const [select, setSelect] = useState<itemInventarioType>()
  const [open, setOpen] = useState<boolean>(false)
  const [openMover, setOpenMover] = useState<boolean>(false)
  useEffect(() => {
    obtenerFruta()
  }, [])


  useEffect(() => {
    if (
      eventoServidor === 'inventario_desverdizado') {
      obtenerFruta()
    }
  }, [triggerServer])


  const handleSelect = (lote: itemInventarioType): void => {
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
        showCuartodesverdizado={true}
        onFiltersChange={setCurrentFilters} />

      <ModalParametros select={select} open={open} onClose={():void => setOpen(false)} />

        <ModalMoverFruta select={select} open={openMover} onClose={(): void => setOpenMover(false)} />

      <BotonesDesverdizado
        setOpen={setOpen}
        setOpenMover={setOpenMover}
        select={select}
        data={data}
      />

      <TablaInventarioDesverdizado
        handleSelect={handleSelect}
        data={data} />
    </div>
  )
}

