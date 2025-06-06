/* eslint-disable prettier/prettier */
import { useRef } from "react";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";

type propsType = {
    setPage: (e: number) => void
    page: number
    numeroElementos: number | undefined
    division: number
}

export default function BotonesPasarPaginas(props: propsType): JSX.Element {

    const timeoutRef = useRef<number>();

    const debounceSetPage = (nextPage: number):void => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            props.setPage(nextPage);
        }, 300);
    };

    return (
        <div className="botones-pasar-pagina">
            <button
                onClick={(): void => {
                    if (props.page > 1) {
                        debounceSetPage(props.page - 1);
                    }
                }}>
                <GrLinkPrevious />
            </button>
            {props.page}
            {props.numeroElementos && Math.floor(props.numeroElementos / (props.division * props.page)) === 0 ?
                <button >
                    <GrLinkNext />
                </button>
                :
                <button onClick={(): void => debounceSetPage(props.page + 1)}>
                    <GrLinkNext />
                </button>}
        </div>
    )
}