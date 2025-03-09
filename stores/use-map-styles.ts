import {MAP_VIEW_STYLES_DEFAULT, type MapViewStylesType} from "~/types/BasicTypes";

export type MapStylesStoreType = { debug: boolean, mapStyle: MapViewStylesType };
export type MapStylesStoreKeyType = keyof MapStylesStoreType;

export function useMapStyles(): MapStylesStoreType {

    const debug = false;
    const mapStyle = MAP_VIEW_STYLES_DEFAULT as MapViewStylesType;

    return reactive({debug, mapStyle});
}
