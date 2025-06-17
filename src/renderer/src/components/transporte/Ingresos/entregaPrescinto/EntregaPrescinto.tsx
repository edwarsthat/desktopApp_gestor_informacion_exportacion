/* eslint-disable prettier/prettier */

import FormSelect from "@renderer/components/UI/components/FormSelect";
import useAppContext from "@renderer/hooks/useAppContext";
import useForm from "@renderer/hooks/useForm";
import { contenedoresType } from "@renderer/types/contenedoresType";
import { useEffect, useRef, useState } from "react";
import { formKeys, formSchema, formType, initForm } from "./validations/validations";
import FormInput from "@renderer/components/UI/components/Forminput";
const MAX_SIZE = 8 * 1024 * 1024; // 5 MB

export default function EntregaPrescinto(): JSX.Element {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { messageModal, setLoading, loading } = useAppContext();
    const { formState, formErrors, handleChange, validateForm, resetForm } = useForm<formType>(initForm);
    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    const [fotos, setFotos] = useState<File[]>([]);
    const [fotosError, setFotosError] = useState<string>("");

    useEffect(() => {
        obtenerContenedores();
    }, [])
    const obtenerContenedores = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "get_transporte_contenedores_entregaPrescinto"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200) {
                throw new Error(response.message || "Error al obtener los contenedores");
            }
            console.log(response)
            setContenedores(response.data);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false)
        }
    }
    const guardarData = async (e): Promise<void> => {
        e.preventDefault();
        try {
            setLoading(true)
            if (fotos.length < 1 || fotos.length > 3) {
                setFotosError("Por favor ingrese de 1 a 3 fotos como maximo");
                return;
            } else if (!fotos.every(file => file.type.startsWith("image/"))) {
                setFotosError("Solo se permiten archivos de imagen (jpg, png, etc).");
                return;
            } else if (!fotos.every(file => file.size <= MAX_SIZE)) {
                setFotosError("Cada foto debe pesar máximo 5 MB.");
                return;
            } else {
                setFotosError("");
            }
            const result = validateForm(formSchema)
            if (!result) return;

            // Convertir todas las fotos a base64
            const fotosBase64 = await Promise.all(fotos.map(fileToBase64));

            const request = {
                data: formState,
                fotos: fotosBase64,
                action: "post_transporte_conenedor_entregaPrecinto"
            }
            const response = await window.api.server2(request);

            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }
            messageModal("success", "Entrega de precinto guardada correctamente");
            if (fileInputRef.current) fileInputRef.current.value = "";
            setFotos([]);
            resetForm();
            obtenerContenedores();
        }
        catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false)
        }
    }
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (): void => resolve(reader.result as string);
            reader.onerror = (error): void => reject(error);
        });
    };
    return (
        <div>
            <div className="navBar"></div>
            <h2>Entrega documentos y precinto</h2>
            <hr />
            <form className="form-container" onSubmit={guardarData} >
                <FormSelect
                    name="_id"
                    value={formState._id}
                    label="Contenedores"
                    onChange={handleChange}
                    error={formErrors._id}
                    data={
                        Array.isArray(contenedores)
                            ? contenedores.map((item) => ({
                                _id: item._id,
                                name: `${item.numeroContenedor} - ${typeof item.infoContenedor?.clienteInfo === "object"
                                    ? item.infoContenedor.clienteInfo.CLIENTE
                                    : ""
                                    }`
                            }))
                            : []
                    }
                />
                {Object.entries(formKeys).map(([key, label]) => (
                    <FormInput
                        key={key}
                        name={key as keyof formType}
                        label={label}
                        type={key === "fechaEntrega" ? "datetime-local" : "text"}
                        value={formState[key]}
                        onChange={handleChange}
                        error={formErrors[key]}
                    />

                ))}
                <div className="form-group">
                    <label className="form-label" htmlFor="fotos-entrega-precinto">
                        Fotos
                    </label>
                    <input
                        id="fotos-entrega-precinto"
                        ref={fileInputRef}
                        multiple
                        type="file"
                        accept="image/*"
                        className={`form-input`}
                        onChange={(e): void => {
                            if (e.target.files) {
                                const files = Array.from(e.target.files).slice(0, 3);
                                setFotos(Array.from(files));
                                setFotosError("");
                            }
                        }}
                    />
                    {fotosError !== '' && <p className="form-error">{fotosError}</p>}

                </div>
                <div className="defaultSelect-button-div">
                    <button disabled={loading} type="submit">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}