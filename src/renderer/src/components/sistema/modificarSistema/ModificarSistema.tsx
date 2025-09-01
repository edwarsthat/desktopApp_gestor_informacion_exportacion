/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext';
import './ModificarSistema.css';

export default function ModificarSistema(): JSX.Element {
    const { messageModal } = useAppContext();
    const handleReiniciarOrdenVaceo = async (): Promise<void> => {
        try {
            const request = {
                action: "put_sistema_reiniciar_orden_vaceo"
            }
            const response = await window.api.server2(request);
            if(response.status !== 200){
                throw new Error(`Code: ${response.status}: ${response.message}`);
            }
            messageModal("success", "El orden de vaciado ha sido reiniciado exitosamente.");
        } catch (error) {
            if(error instanceof Error) {
                console.error("Error al reiniciar el orden de vaciado:", error);
                messageModal("error", error.message);
            } else {
                messageModal("error", "Ha ocurrido un error inesperado.");
            }
        }
    };

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Modificar Sistema</h2>
            <hr />
            
            <div className="modificar-sistema-container">
                <div className="card-reiniciar-orden">
                    <h3 className="card-title">
                        🔄 Gestión de Orden de Vaciado
                    </h3>
                    <p className="card-description">
                        Utilice esta opción para reiniciar el orden de vaciado del sistema cuando sea necesario. 
                        Esta acción restablecerá la secuencia de procesamiento a su estado inicial.
                    </p>
                    <button 
                        className="btn-reiniciar-orden"
                        onClick={handleReiniciarOrdenVaceo}
                    >
                        Reiniciar orden vaceo
                    </button>
                </div>
            </div>
        </div>
    );
}
