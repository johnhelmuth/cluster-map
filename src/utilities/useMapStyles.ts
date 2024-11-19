import {ref } from "vue";
import type {MapViewStylesType} from "@/types/BasicTypes";

const debug = ref(false);
const mapStyle = ref('data' as MapViewStylesType);
const straightStraits = ref(true);

export function useMapStyles() {
  return { mapStyle, straightStraits, debug };
}
