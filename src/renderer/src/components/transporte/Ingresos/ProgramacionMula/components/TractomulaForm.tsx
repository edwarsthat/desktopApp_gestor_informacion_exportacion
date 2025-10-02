/* eslint-disable prettier/prettier */

import useForm from "@renderer/hooks/useForm"
import { labelTractomulaForm, tractomulaFormInit, tractomulaFormType } from "../validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
import { contenedoresType } from "@renderer/types/contenedoresType";
import FormSelect from "@renderer/components/UI/components/FormSelect";

type propsType = {
    contenedores: contenedoresType[]
}

export default function TractomulaForm({ contenedores }: propsType): JSX.Element {
    const { formState, handleChange, formErrors, handleArrayChange } = useForm<tractomulaFormType>(tractomulaFormInit);

    return (
        <>
            {
                Object.entries(labelTractomulaForm).map(([key, label]) => {
                    if (key === "contenedor" ) {
                        return (
                            <FormSelect
                                key={key}
                                name={key}
                                value={formState[key]}
                                label={label}
                                onChange={handleArrayChange}
                                error={formErrors[key]}
                                data={contenedores.map((item) => ({ _id: item._id, name: `${item.numeroContenedor}` }))}
                            />
                        )
                    }
                    return (
                        <FormInput
                            key={key}
                            name={key}
                            label={label}
                            type="text"
                            value={formState[key]}
                            onChange={handleChange}
                            error={formErrors[key]}
                        />
                    )
                })
            }
        </>
    )
}