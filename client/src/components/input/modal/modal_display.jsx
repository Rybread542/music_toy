import { createPortal } from "react-dom";


export function Modal_Display({isOpen, children}) {

    if (!isOpen) {
        return null
    }

    return createPortal(
        <div className="modal-container">
            {children}
        </div>,
        document.body
    )
}