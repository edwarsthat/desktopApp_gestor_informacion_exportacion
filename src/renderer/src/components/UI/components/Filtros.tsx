/* eslint-disable prettier/prettier */
import { obtener_proveedores2 } from '@renderer/functions/SystemRequest'
import useAppContext from '@renderer/hooks/useAppContext'
import { FilterValues, useFiltro } from '@renderer/hooks/useFiltro'
import useGetCatalogData from '@renderer/hooks/useGetCatalogData'
import { proveedoresType } from '@renderer/types/proveedoresType'
import { useEffect, useState } from 'react'

type FiltrosProps = {
  showTipoFruta?: boolean // El ? hace que sea opcional
  showFechaInicio?: boolean
  showFechaFin?: boolean
  showGGN?: boolean
  showBuscar?: boolean
  showProveedor?: boolean
  showTipoFecha?: boolean
  showEF?: boolean
  showButton?: boolean
  showAll?: boolean
  showCuartodesverdizado?: boolean
  showDivisionTiempo?: boolean
  onFiltersChange: (filters: FilterValues) => void
  findFunction?: () => Promise<void>
  ggnId?: string
  allId?: string
}

export default function Filtros({
  showTipoFruta = false,
  showFechaInicio = false,
  showFechaFin = false,
  showGGN = false,
  showBuscar = false,
  showProveedor = false,
  showTipoFecha = false,
  showEF = false,
  showButton = false,
  showAll = false,
  showCuartodesverdizado = false,
  showDivisionTiempo = false,
  findFunction,
  onFiltersChange,
  ggnId = 'defaultGGN',
  allId = 'defaultAll',

}: FiltrosProps): JSX.Element {
  const { messageModal } = useAppContext()
  const [tipoFrutaArr, setTipoFrutaArr] = useState<string[]>([])
  const [proveedores, setProveedores] = useState<proveedoresType[]>([])
  const { obtenerCuartosDesverdizados, cuartosDesverdizados } = useGetCatalogData();

  const {
    tipoFruta, setTipoFruta,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    GGN, setGGN,
    buscar, setBuscar,
    proveedor, setProveedor,
    tipoFecha, setTipoFecha,
    EF, setEF,
    all, setAll,
    cuartoDesverdizado, setCuartoDesverdizado,
    divisionTiempo, setDivisionTiempo
  } = useFiltro()

  //se obtienen los datos del servidor
  useEffect(() => {
    const obtenerTipoFruta = async (): Promise<void> => {
      try {
        const response = await window.api.obtenerFruta()
        if (response instanceof Error) {
          throw new Error(response.message)
        }
        setTipoFrutaArr(response)
      } catch (err) {
        if (err instanceof Error) {
          messageModal('error', err.message)
        }
      }
    }
    const obtenerProveedores = async (): Promise<void> => {
      try {
        const response = await obtener_proveedores2("all")
        if (response instanceof Error) {
          throw new Error(response.message)
        }
        setProveedores(response)
      } catch (err) {
        if (err instanceof Error) {
          messageModal('error', err.message)
        }
      }
    }
    obtenerCuartosDesverdizados()
    obtenerTipoFruta()
    obtenerProveedores()
  }, [])

  useEffect(() => {
    // Construct the object with current filter values
    const currentFilterValues: FilterValues = {
      tipoFruta,
      fechaInicio,
      fechaFin,
      GGN,
      buscar,
      proveedor,
      tipoFecha,
      EF,
      cuartoDesverdizado,
      divisionTiempo,
      all
    }
    // Call the parent's callback
    onFiltersChange(currentFilterValues)
  }, [
    tipoFruta,
    proveedor,
    fechaInicio,
    fechaFin,
    GGN,
    buscar,
    tipoFecha,
    EF,
    all,
    cuartoDesverdizado,
    divisionTiempo,
    onFiltersChange
  ])

const handleClick = async ():Promise<void> => {
  if (typeof findFunction === "function") {
    await findFunction();
  } else {
    alert("findFunction no es función!");
  }
};

  return (
    <div className="filtroContainer">
      <div>
        {showTipoFruta && (
          <select
            aria-label="Selecciona una opción"
            onChange={(e): void => {
              setTipoFruta(e.target.value)
            }}
          >
            <option value="">Seleccione un tipo de fruta</option>
            {tipoFrutaArr.map((tipo, index) => (
              <option key={index} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        )}
        {showProveedor && (
          <select
            aria-label="Selecciona un predio"
            onChange={(e): void => {
              setProveedor(e.target.value)
            }}
          >
            <option value="">Seleccione un predio</option>
            {proveedores.map((item) => (
              <option key={item._id} value={item._id}>
                {item.PREDIO ?? ''}
              </option>
            ))}
          </select>
        )}
        {showCuartodesverdizado && (
          <select
            aria-label="Selecciona un cuarto desverdizado"
            onChange={(e): void => {
              setCuartoDesverdizado(e.target.value)
            }}
          >
            <option value="">Seleccione cuarto desverdizado</option>
            {cuartosDesverdizados.map((item) => (
              <option key={item._id} value={item._id}>
                {item.nombre ?? ''}
              </option>
            ))}
          </select>
        )}
        {showEF && (
          <>
            <input type="text" placeholder='EF-' onChange={(e): void => setEF(e.target.value)} />
          </>
        )}        {showGGN && (
          <div className="checkbox-container">
            <input
              type="checkbox"
              id={`ggn-checkbox-${ggnId}`}
              name={`ggn-checkbox-${ggnId}`}
              onChange={(e): void => setGGN(e.target.checked)}
            />
            <span className="checkmark"></span>
            <label htmlFor={`ggn-checkbox-${ggnId}`}>Fruta GGN</label>
          </div>
        )}
        {showDivisionTiempo && (
          <select
            aria-label="Division de tiempo"
            onChange={(e): void => {
              setDivisionTiempo(e.target.value)
            }}
          >
            <option value="">División tiempo</option>
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
          </select>
        )}
        {showTipoFecha && (
          <select
            aria-label="Selecciona un predio"
            onChange={(e): void => {
              setTipoFecha(e.target.value)
            }}
          >
            <option value="">Tipo de fecha</option>
            <option value="fecha_creacion">Fecha creacion</option>
            <option value="fecha_ingreso_inventario">Fecha ingreso</option>
            <option value="fechaProceso">Fecha Proceso</option>
          </select>
        )}
        {showFechaInicio && (
          <>
            <label> Fecha Inicio</label>
            <input
              type="date"
              onChange={(e): void => setFechaInicio(e.target.value)}
            />
          </>
        )}
        {showFechaFin && (
          <>
            <label> Fecha Fin</label>
            <input type="date" onChange={(e): void => setFechaFin(e.target.value)} />
          </>
        )}
        {showBuscar && (
          <>
            <input type="text" placeholder='Buscar...' onChange={(e): void => setBuscar(e.target.value)} />
          </>
        )}
        {showAll && (
          <div className="checkbox-container">
            <input
              type="checkbox"
              id={`all-checkbox-${allId}`}
              name={`all-checkbox-${allId}`}
              onChange={(e): void => setAll(e.target.checked)}
            />
            <span className="checkmark"></span>
            <label htmlFor={`all-checkbox-${allId}`}>Todos</label>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: 'flex-end' }}>
        {showButton &&
<button onClick={handleClick} disabled={typeof findFunction !== 'function'}>
  Buscar
</button>}
      </div>
    </div>
  )
}
