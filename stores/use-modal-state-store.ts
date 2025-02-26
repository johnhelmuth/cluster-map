/**
 * Storage for which modal-like widget is currently open/active, so that the other modals can be shut down when a new
 * one opens.
 */

export type ModalIdType = string;
export type ModalCloseCallback = () => void;

/**
 * The identifier for the current modal-like widget.
 */
let currentModalId : ModalIdType|null = null;

/**
 * A map of callbacks for each modal-like widget that needs to be managed.
 */
const modalCloseCallbacks = new Map<ModalIdType,ModalCloseCallback>();

/**
 * Is this the current modal-like widget?
 *
 * @param modalId {ModalIdType}
 */
function isCurrentModal(modalId: MaybeRef<ModalIdType>) {
    return currentModalId === toValue(modalId);
}

/**
 * Adds a callback function to a given modal-like widget to be called when the modal-like widget should be closed
 * because another one is opening.
 *
 * @param modalId {ModalIdType} - the modal-like widget's identifier
 * @param closeCallback {ModalCloseCallback} - the modal-like widget's callback function to close it.
 */
function onModalClose(modalId: MaybeRef<ModalIdType>, closeCallback: ModalCloseCallback) {
    modalCloseCallbacks.set(toValue(modalId), closeCallback)
}

/**
 * Sets which modal-like widget is open, closes the current modal-like widget, if any.
 *
 * @param modalId {ModalIdType}
 */
function setCurrentOpenModal(modalId: MaybeRef<ModalIdType>) {
    const newModalId = toValue(modalId);
    if (newModalId && currentModalId &&
        ! isCurrentModal(newModalId) &&
        modalCloseCallbacks.has(currentModalId)
    ) {
        const closeCallback = modalCloseCallbacks.get(currentModalId);
        if (closeCallback) {
            closeCallback();
        }
    }
    currentModalId = newModalId;
}

/**
 * Indicates that a modal-like widget is closed.
 *
 * @param modalId {MaybeRef<ModalIdType>}
 */
function closeModal(modalId: MaybeRef<ModalIdType>) {
    if (isCurrentModal(modalId)) {
        currentModalId = null;
    }
}

export function useModalStateStore(modalId: MaybeRef<ModalIdType>, cb: ModalCloseCallback) {
    onModalClose(toValue(modalId), cb);
    return {
        isCurrentModal: () => isCurrentModal(modalId),
        setCurrentOpenModal: () => setCurrentOpenModal(modalId),
        closeModal: () => closeModal(modalId),
    };
}
