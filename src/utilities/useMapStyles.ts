import {ref, defineEmits, watch } from "vue";
import type {ClusterOrientationType, MapViewStylesType} from "@/types/BasicTypes";

const debug = ref(false);
const mapStyle = ref('data' as MapViewStylesType);
const straightStraits = ref(true);
const clusterOrientation = ref('landscape' as ClusterOrientationType);

export function useMapStyles() {
  return { mapStyle, straightStraits, clusterOrientation, debug };
}
