
import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";
import type {UniversesMetadataModelInterface} from "~/types/ClusterTypes";

export const useUniversesStore
    = defineStore(
    'universes',
    () => {

        const universes = reactive(new UniversesMetadataModel() as UniversesMetadataModelInterface);

        async function fetchUniversesData() {
            const { data } = await useAsyncData(`universes`, async () => {
                const serversUniversesMetaData = await $fetch('/api/universes');
                // @ts-ignore
                universes.parseUniversesMetadata(serversUniversesMetaData);
                console.log('fetchUniversesData() universes: ', universes);
                return { universes }
            });
            return data;
        }

        function hasUniverse() {
            return universes.hasCurrentUniverse();
        }

        return { universes, fetchUniversesData, hasUniverse };
    }
);
