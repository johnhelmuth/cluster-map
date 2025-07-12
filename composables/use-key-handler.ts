import {useModalStateStore} from "~/stores/use-modal-state-store";

const { closeCurrentModal } = useModalStateStore()

function KeyHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeCurrentModal()
  }
}

export function useKeyHandler() {
  return {
    KeyHandler
  }
}
