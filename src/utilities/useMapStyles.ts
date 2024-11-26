import {ref} from "vue";
import {defineStore} from 'pinia';

import type {MapViewStylesType} from "@/types/BasicTypes";

export const useMapStyles = defineStore(
  "mapStyles",
  () => {

    const debug = ref(false);
    const mapStyle = ref('data' as MapViewStylesType);
    const straightStraits = ref(true);

    const mapStylesDataFromLC = localStorage.getItem("pinia.cluster-map.mapStyles");
    if (mapStylesDataFromLC) {
      try {
        const mapStylesData = JSON.parse(mapStylesDataFromLC);
        if (typeof mapStylesData === 'object') {
          if (mapStylesData.hasOwnProperty('debug')) {
            debug.value = !! (mapStylesData?.debug)
          }
          if (mapStylesData.hasOwnProperty('mapStyle')) {
            mapStyle.value = mapStylesData?.mapStyle
          }
          if (mapStylesData.hasOwnProperty('straightStraits')) {
            straightStraits.value = !! (mapStylesData?.straightStraits)
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return { debug, mapStyle, straightStraits };
  }
)
