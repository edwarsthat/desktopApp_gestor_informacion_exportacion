/* eslint-disable prettier/prettier */
import { useState } from 'react'
import TableHistorialDirectoNacional from './components/TableHistorialDirectoNacional'
import { lotesType } from '@renderer/types/lotesType'
import useFetchDataFilter from '@renderer/hooks/useFetchDataFilter'
import { useFiltroValue } from '@renderer/hooks/useFiltro'
import Filtros from '@renderer/components/UI/components/Filtros'
import ModalHistorialDirectoNacional from './components/ModalHistorialDirectoNacional'



export default function HistorialDirectoNacional(): JSX.Element {
  const { currentFilters, setCurrentFilters } = useFiltroValue();
  const { data, obtenerData } = useFetchDataFilter<lotesType>({
    currentFilters,
    actionData: 'get_inventarios_historialDirectoNacional_registros',
  })
  const [itemSeleccionado, setItemSeleccionado] = useState<lotesType>()
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <div className='navBar'></div>
      <h2>Historial Directo Nacional</h2>
      <hr />
      <Filtros
        showFechaInicio={true}
        showFechaFin={true}
        onFiltersChange={setCurrentFilters}
        showButton={true}
        findFunction={obtenerData}
      />

      <TableHistorialDirectoNacional
        data={data}
        setOpen={setOpen}
        setItemSeleccionado={setItemSeleccionado}
      />

      <ModalHistorialDirectoNacional 
        obtenerData={obtenerData}
        itemSeleccionado={itemSeleccionado}
        open={open}
        onClose={(): void => setOpen(false)}
      />

    </div>
  )
}
