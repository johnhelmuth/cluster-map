import {ref} from "vue";
import type {MapViewStylesType} from "@/types/BasicTypes";
import {useModal} from "vue-final-modal";
import {useMapStyles} from "@/utilities/useMapStyles";
import MapClusterStyleModal from "@/components/Modals/MapClusterStyleModal.vue";

const { mapStyle, debug, straightStraits, clusterOrientation  } = useMapStyles();

export function useMapViewStyleModal() {

  const mapViewTypeModal = useModal({
    component: MapClusterStyleModal,
    attrs: {
      onClose() {
        mapViewTypeModal.close();
      }
    },
  });

  return { mapStyle, debug, straightStraits, mapViewTypeModal, clusterOrientation };
}
