import {MAP_VIEW_STYLES_DEFAULT, type MapViewStylesType} from "~/types/BasicTypes";

export function useMapStyles(): { debug: boolean, mapStyle: MapViewStylesType, straightStrait: boolean } {

    const debug = false;
    const mapStyle = MAP_VIEW_STYLES_DEFAULT as MapViewStylesType;
    const straightStraits = true;

    // const mapStylesDataFromLC = localStorage.getItem("pinia.cluster-map.mapStyles");
    // if (mapStylesDataFromLC) {
    //   try {
    //     const mapStylesData = JSON.parse(mapStylesDataFromLC);
    //     if (typeof mapStylesData === 'object') {
    //       if (mapStylesData.hasOwnProperty('debug')) {
    //         debug.value = !! (mapStylesData?.debug)
    //       }
    //       if (mapStylesData.hasOwnProperty('mapStyle')) {
    //         mapStyle.value = mapStylesData?.mapStyle
    //       }
    //       if (mapStylesData.hasOwnProperty('straightStraits')) {
    //         straightStraits.value = !! (mapStylesData?.straightStraits)
    //       }
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
    //
    // watch(
    //   [debug, mapStyle, straightStraits],
    //   () => {
    //     const mapStylesData = {
    //       debug: !! debug.value,
    //       mapStyle: mapStyle.value || MAP_VIEW_STYLES_DEFAULT,
    //       straightStraits: !! straightStraits.value,
    //     }
    //     localStorage.setItem("pinia.cluster-map.mapStyles", JSON.stringify(mapStylesData));
    //   },
    //   { deep: true }
    // );

    return reactive({debug, mapStyle, straightStraits});
}
