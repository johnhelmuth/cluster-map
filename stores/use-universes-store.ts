import type {
  UniverseModelInterface,
  UniversesMetadataModelInterface
} from "~/types/ClusterTypes";
import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";
import type {UniverseModel} from "~/models/UniverseModel";

export const useUniversesStore
  = defineStore(
  'universes',
  () => {

    const universes = reactive(new UniversesMetadataModel());

    async function fetchUniversesData() {
      const { data } = await useAsyncData(`universes`, async () => {
        const serversUniversesMetadata = await $fetch('/api/universes');
        universes.parseUniversesMetadata(serversUniversesMetadata);
        return { universes }
      });
      return data;
    }

    function hasUniverse() {
      return universes.hasCurrentUniverse();
    }

    function isUniverseLoaded(universe: UniverseModelInterface | null): universe is UniverseModel {
      return !! universe;
    }

    return { universes, fetchUniversesData, hasUniverse, isUniverseLoaded };

  }
);