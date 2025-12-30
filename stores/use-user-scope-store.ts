import type {SelectedSystemsServiceDataType} from "@/types/SystemsSelectedListTypes";

import {SelectedSystemsService} from "@/models/SelectedSystemsService";
import {RoutePlannerService} from "@/utils/route-planner-service";
import {useClustersStore} from "~/stores/use-clusters-store";

const SELECTED_SYSTEMS_KEY_NAME = "cm-selected-systems";

export function useUserScopeStore() {
  const {hasLocalStorage, getLocalStorage} = useLocalStorage();
  const { clusters } = useClustersStore();

  const routePlannerService = reactive(new RoutePlannerService());
  const selectedSystemsService = reactive(new SelectedSystemsService());

  onMounted(() => {
    if (hasLocalStorage()) {
      const selectedSystemsServiceDataJSON = getLocalStorage().getItem(SELECTED_SYSTEMS_KEY_NAME);
      if (selectedSystemsServiceDataJSON) {
        const selectedSystemsServiceData = JSON.parse(selectedSystemsServiceDataJSON) as SelectedSystemsServiceDataType;
        if (selectedSystemsServiceData) {
          const selectedSystemsHydrated = hydrateSelectedSystemsServiceData(selectedSystemsServiceData);
          if (selectedSystemsHydrated) {
            selectedSystemsService.loadData(selectedSystemsHydrated);
          }
        }
      }
      watch(selectedSystemsService, (newVal, oldVal) => {
        const selectedSystemsServiceData = selectedSystemsService.toJSON();
        const selectedSystemsServiceDataJSON = JSON.stringify(selectedSystemsServiceData);
        console.log("Watching selectedSystemsService... selectedSystemsServiceDataJSON", selectedSystemsServiceDataJSON)
        getLocalStorage().setItem(SELECTED_SYSTEMS_KEY_NAME, selectedSystemsServiceDataJSON);
      });
    }
  })

  function hydrateSelectedSystemsServiceData(selectedSystemsServiceData: SelectedSystemsServiceDataType) {
    if (selectedSystemsServiceData && selectedSystemsServiceData.length > 0) {
      const hydratedSystemsServiceData = selectedSystemsServiceData.map(([clusterId, selectedSystems]) => {
        const selectedSystemsHydrated = selectedSystems.map(systemId => {
          const cluster = clusters.getClusterById(clusterId);
          if (cluster) {
            return cluster.getSystemById(systemId);
          }
        });
        return [clusterId, selectedSystemsHydrated];
      })
      if (hydratedSystemsServiceData) {
        return hydratedSystemsServiceData;
      }
    }
  }

  return {routePlannerService, selectedSystemsService};
}
