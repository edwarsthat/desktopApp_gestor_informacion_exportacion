/* eslint-disable prettier/prettier */
import { sumatoriaTipoDescarte } from "../function/sumatorias"
import { formType, inventarioDescarteType } from "../types/types"
import '../css/inventarioDescarteDataStyles.css'
import FormInput from "@renderer/components/UI/components/Forminput"
type propsType = {
    data: inventarioDescarteType
    handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
    formState: formType
    formErrors: Partial<Record<keyof formType | string, string>>
}

export default function InventarioData(props: propsType): JSX.Element {
    return (
        <div className="container-inventario-descarte-data">
            <div>
                <h3>Descarte Lavado</h3>
                <h4>Descarte Lavado {sumatoriaTipoDescarte(props.data.total.descarteLavado, "descarteLavado")} Kg</h4>

                <div className="container-inventario-descarte-data2">
                    <p>Descarte General: {props.data.total.descarteLavado.descarteGeneral}Kg</p>
                    <FormInput
                        name="descarteLavado:descarteGeneral"
                        label=""
                        type="text"
                        value={props.formState["descarteLavado:descarteGeneral"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteLavado:descarteGeneral"]}
                    />

                    <p>Pareja: {props.data.total.descarteLavado.pareja}Kg</p>
                    <FormInput
                        name="descarteLavado:pareja"
                        label=""
                        type="text"
                        value={props.formState["descarteLavado:pareja"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteLavado:pareja"]}
                    />

                    <p>Balin: {props.data.total.descarteLavado.balin}Kg</p>
                    <FormInput
                        name="descarteLavado:balin"
                        label=""
                        type="text"
                        value={props.formState["descarteLavado:balin"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteLavado:balin"]}
                    />
                </div>

            </div>
            <div>
                <h3>Descarte Encerado</h3>
                <h4>Descarte Encerado {sumatoriaTipoDescarte(props.data.total.descarteEncerado, "descarteEncerado")}Kg</h4>

                <div className="container-inventario-descarte-data2">
                    <p>Descarte General: {props.data.total.descarteEncerado.descarteGeneral}Kg</p>
                    <FormInput
                        name="descarteEncerado:descarteGeneral"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:descarteGeneral"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:descarteGeneral"]}
                    />

                    <p>Pareja: {props.data.total.descarteEncerado.pareja}Kg</p>
                    <FormInput
                        name="descarteEncerado:pareja"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:pareja"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:pareja"]}
                    />


                    <p>Balin: {props.data.total.descarteEncerado.balin}Kg</p>
                    <FormInput
                        name="descarteEncerado:balin"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:balin"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:balin"]}
                    />

                    <p>Extra: {props.data.total.descarteEncerado.extra}Kg</p>
                    <FormInput
                        name="descarteEncerado:extra"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:extra"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:extra"]}
                    />

                    <p>Suelo: {props.data.total.descarteEncerado.suelo}Kg</p>
                    <FormInput
                        name="descarteEncerado:suelo"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:suelo"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:suelo"]}
                    />

                    <p>Fruta Nacional: {props.data.total.descarteEncerado.frutaNacional}Kg</p>
                    <FormInput
                        name="descarteEncerado:frutaNacional"
                        label=""
                        type="text"
                        value={props.formState["descarteEncerado:frutaNacional"]}
                        onChange={props.handleChange}
                        error={props.formErrors["descarteEncerado:frutaNacional"]}
                    />
                </div>
            </div>
        </div>
    )
}