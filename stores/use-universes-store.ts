import type {
    UniverseModelInterface
} from "~/types/ClusterTypes";
import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";
import {UniverseModel} from "~/models/UniverseModel";

export const useUniversesStore
    = defineStore(
    'universes',
    async () => {
        const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';

        const { data } = await useAsyncData(`universes`, async () => {
            console.log(`${logLabel} useUniversesStore().useAsyncData callback.`)

            const serversUniversesMetaData = await $fetch('/api/universes');

            console.log(`${logLabel} useUniversesStore().useAsyncData callback. serversUniversesMetaData: `, serversUniversesMetaData);
            const universesMetadata = new UniversesMetadataModel(serversUniversesMetaData);
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universesMetadata: `, universesMetadata);

            const universeData = await $fetch(`/api/universe/${universesMetadata.currentUniverseId}`);

            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universeData: `, universeData);
            let universe: UniverseModelInterface = new UniverseModel();
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. 1 universe: `, universe);
            if (universeData) {
                universe.parseUniverseData(universeData);
            }
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. 2 universe: `, universe);
            return { universe, universes: universesMetadata };
        });
        console.log(`${logLabel} useUniversesStore().setup() data: `, data);

        return data;
    }
);
