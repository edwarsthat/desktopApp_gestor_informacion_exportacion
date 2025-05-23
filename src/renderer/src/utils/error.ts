/* eslint-disable prettier/prettier */
export function getErrorMessages(zodError): object {
    const errors = {};
    zodError.errors.forEach((err) => {
        const path = err.path[0]; // Solo usamos el primer nivel
        errors[path] = err.message;
    });
    return errors;
}