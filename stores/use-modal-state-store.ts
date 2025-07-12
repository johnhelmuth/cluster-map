/**
 * Storage for which modal-like widget is currently open/active, so that the other modals can be shut down when a new
 * one opens.
 */

export type ModalIdType = string;
export type ModalCloseCallback = () => void;

/**
 * The identifier for the current modal-like widget.
 */
let currentModalId = ref(null as ModalIdType | null);

/**
 * A map of callbacks for each modal-like widget that needs to be managed.
 */
const modalCloseCallbacks = new Map<ModalIdType, ModalCloseCallback>();

/**
 * Is this the current modal-like widget?
 *
 * @param modalId {ModalIdType|undefined}
 */
function isCurrentModal(modalId?: MaybeRef<ModalIdType>) {
  return !!modalId && !!toValue(modalId) && currentModalId.value === toValue(modalId);
}

/**
 * Adds a callback function to a given modal-like widget to be called when the modal-like widget should be closed
 * because another one is opening.
 *
 * @param modalId {ModalIdType|undefined} - the modal-like widget's identifier
 * @param closeCallback {ModalCloseCallback|undefined} - the modal-like widget's callback function to close it.
 */
function onModalClose(modalId?: MaybeRef<ModalIdType>, closeCallback?: ModalCloseCallback) {
  if (typeof modalId !== 'undefined' && toValue(modalId) && closeCallback) {
    modalCloseCallbacks.set(toValue(modalId), closeCallback)
  }
}

/**
 * Sets which modal-like widget is open, closes the current modal-like widget, if any.
 *
 * @param modalId {ModalIdType|undefined}
 */
function setCurrentOpenModal(modalId?: MaybeRef<ModalIdType>) {
  const newModalId = toValue(modalId);
  if (newModalId) {
    if (!isCurrentModal(newModalId)) {
      closeCurrentModal();
    }
    currentModalId.value = newModalId || null; // An empty string should be stored as null.
  } else {
    currentModalId.value = null;
  }
}

/**
 * Indicates that a modal-like widget is closed.
 *
 * @param modalId {MaybeRef<ModalIdType>|undefined}
 */
function closeModal(modalId?: MaybeRef<ModalIdType>) {
  if (isCurrentModal(modalId)) {
    currentModalId.value = null;
  }
}

/**
 * Indicates that the current modal should be closed.
 */
function closeCurrentModal() {
  if (currentModalId.value &&
    modalCloseCallbacks.has(currentModalId.value)
  ) {
    const closeCallback = modalCloseCallbacks.get(currentModalId.value);
    if (closeCallback) {
      closeCallback();
    }
  }
}

export function useModalStateStore(modalId?: MaybeRef<ModalIdType>, cb?: ModalCloseCallback) {
  if (modalId && cb) {
    onModalClose(toValue(modalId), cb);
  }
  return {
    isCurrentModal: () => isCurrentModal(modalId),
    setCurrentOpenModal: () => setCurrentOpenModal(modalId),
    closeModal: () => closeModal(modalId),
    closeCurrentModal
  };
}
