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

            const serversUniversesMetaData = await $fetch('/api/universes');

            console.log(`${logLabel} useUniversesStore().useAsyncData callback. serversUniversesMetaData: `, serversUniversesMetaData);
            const universesMetadata = new UniversesMetadataModel(serversUniversesMetaData);
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universesMetadata: `, universesMetadata);

            const universe = await universesMetadata.getCurrentUniverse();
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universe: `, universe);
            return { universe, universes: universesMetadata };
        });
        console.log(`${logLabel} useUniversesStore().setup() data: `, data);

        return data;
    }
);
