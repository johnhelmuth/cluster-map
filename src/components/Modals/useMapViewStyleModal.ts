import {useModal} from "vue-final-modal";
import {useMapStyles} from "@/utilities/useMapStyles";
import MapClusterStyleModal from "@/components/Modals/MapClusterStyleModal.vue";


export function useMapViewStyleModal() {

  const mapStylesStore = useMapStyles();

  const mapViewTypeModal = useModal({
    component: MapClusterStyleModal,
    attrs: {
      onClose() {
        mapViewTypeModal.close();
      }
    },
  });

  return { mapStylesStore, mapViewTypeModal };
}
