import type {pointData} from "~/utils/chart-utils";
import type {PointType} from "~/types/GeometryTypes";


export function useChartPopover() {
  const popoverVisible = ref(false);
  const currentDatum = ref(undefined as pointData | undefined);
  const currMousePosition = ref(undefined as PointType | undefined);

  function showPopover(e: MouseEvent, p: pointData) {
    currentDatum.value = p;
    popoverVisible.value = true;
    currMousePosition.value = {x: e.clientX, y: e.clientY};
  }

  function hidePopover(e: MouseEvent) {
    popoverVisible.value = false;
  }

  return { showPopover, hidePopover, popoverVisible, currentDatum, currMousePosition };
}
