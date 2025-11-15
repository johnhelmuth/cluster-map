import {isValidMapStyle, MAP_VIEW_STYLES_DEFAULT, type MapViewStylesType} from "~/types/MapViewTypes";

export type MapStylesStoreType = { debug: boolean, mapStyle: MapViewStylesType };
export type MapStylesStoreKeyType = keyof MapStylesStoreType;

export function useMapStyles(): MapStylesStoreType {

  const route=useRoute();

  let mapStyle = MAP_VIEW_STYLES_DEFAULT as MapViewStylesType;
  if (route.query && route.query?.['map-style']) {
    if (isValidMapStyle(route.query?.['map-style'])) {
      mapStyle = route.query['map-style'];
    }
  }

  const debug = false;
  const mapStylesStore = reactive({debug, mapStyle});

  watch(() => route.query, () => {
    if (route.query?.['map-style']) {
      if (isValidMapStyle(route.query?.['map-style']) && route.query['map-style'] !== mapStylesStore.mapStyle) {
        mapStylesStore.mapStyle = route.query['map-style'];
      }
    } else if (mapStylesStore.mapStyle !== MAP_VIEW_STYLES_DEFAULT) {
      mapStylesStore.mapStyle = MAP_VIEW_STYLES_DEFAULT;
    }
  })

  watch(() => mapStylesStore.mapStyle, () => {
    if (route.query?.['map-style'] !== mapStylesStore.mapStyle) {
      const query = { ...route.query };
      delete(query['map-style']);
      if (mapStylesStore.mapStyle !== MAP_VIEW_STYLES_DEFAULT) {
        query['map-style'] = mapStylesStore.mapStyle;
      }
      return navigateTo({ ...route, query });
    }
  });

  return mapStylesStore;
}
