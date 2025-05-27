/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import "../css/listaOrdenVaceo.css"
import OrdenVaciadoCard from "../utils/OrdenVaciadoCard"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useState } from "react"
import ConfirmacionModal from "@renderer/messages/ConfirmacionModal"
import useAppContext from "@renderer/hooks/useAppContext"
import { requestVaciar } from "../functions/request"
import { useConfirm } from "@renderer/hooks/useModalConfimartion"

type propsType = {
  lotes: lotesType[]
  lotesOrdenVaceo: lotesType[]
  handleRemoveOrdenVaceo: (_id) => void
  handleMoveOrdenVaceo: (source, destination) => void
}

export default function ListaOrdenVaceo(props: propsType): JSX.Element {
  const { messageModal, setLoading, loading } = useAppContext();
  const [activarDropp,] = useState<string>('orden-vaceo-droppable');
  const {
    setShowConfirmation, showConfirmation,
    message, setConfirm, requestConfirm
  } = useConfirm();


  const vaciar = async (): Promise<void> => {
    try {
      setLoading(true)
      if (props.lotesOrdenVaceo.length === 0) {
        throw new Error("Error: no hay lista de orden de vaceo");
      }
      const req = requestVaciar(props.lotesOrdenVaceo[0])
      const response = await window.api.server2(req);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      props.handleRemoveOrdenVaceo(props.lotesOrdenVaceo[0]._id)
      messageModal("success", "Lote vaciado con exito!")
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lista-orden-vaceo-container">
      <DragDropContext onDragEnd={(result): void => {
        const { source, destination } = result;
        if (!destination) {
          return;
        }
        if (source.index === destination.index && destination.droppableId === source.droppableId) {
          return;
        }
        props.handleMoveOrdenVaceo(source.index, destination.index)
      }}>

        <h3>Orden de vaceo</h3>
        <hr />
        <Droppable droppableId={activarDropp} >
          {(droppableProvider): JSX.Element =>

            <div
              ref={droppableProvider.innerRef}
              {...droppableProvider.droppableProps}
              className="lista-orden-vaceo-div"
            >
              {props.lotesOrdenVaceo.map((lote, index) => (
                <Draggable key={lote._id} draggableId={lote._id} index={index}>
                  {(draggableProvider): JSX.Element =>
                    <div
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.draggableProps}
                      {...draggableProvider.dragHandleProps}
                      className="div1"
                    >
                      <OrdenVaciadoCard lote={lote} index={index} handleRemoveOrdenVaceo={props.handleRemoveOrdenVaceo} />
                    </div>}
                </Draggable>
              ))}
              {droppableProvider.placeholder}
            </div>}
        </Droppable>
      </DragDropContext>
      <div className="lista-orden-vaceo-div-button">
        <button
          disabled={loading}
          className="defaulButtonAgree"
          onClick={():void => requestConfirm(vaciar, "¿Seguro desea vacear el lote?")}>
          Vaciar
        </button>
      </div>
      {showConfirmation && <ConfirmacionModal message={message} setConfirmation={setConfirm} setShowConfirmationModal={setShowConfirmation} />}
    </div>

  )
}
