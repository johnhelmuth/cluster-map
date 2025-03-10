import type {
    UniverseModelInterface, UniversesMetadataModelInterface
} from "~/types/ClusterTypes";
import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";

export const useUniversesStore
    = defineStore(
    'universes',
    () => {

        const universe = ref(undefined as UniverseModelInterface | undefined);
        const universesMetadata = ref(undefined as UniversesMetadataModelInterface | undefined);

        async function fetchUniversesData() {
            const { data } = await useAsyncData(`universes`, async () => {

                const serversUniversesMetaData = await $fetch('/api/universes');
                universesMetadata.value = new UniversesMetadataModel(serversUniversesMetaData);

                universe.value = await universesMetadata.value.getCurrentUniverse();
                return { universe, universes: universesMetadata }
            });
            return data;
        }
        return { universe, universes: universesMetadata, fetchUniversesData };
    }
);
