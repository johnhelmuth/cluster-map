import type {
    UniverseModelInterface
} from "~/types/ClusterTypes";
import {UniversesMetaDataModel} from "~/models/UniversesMetaDataModel";
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
            const universes = new UniversesMetaDataModel(serversUniversesMetaData);
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universes: `, universes);

            const universeData = await $fetch(`/api/universe/${universes.currentUniverseId}`);

            console.log(`${logLabel} useUniversesStore().useAsyncData callback. universeData: `, universeData);
            let universe: UniverseModelInterface = new UniverseModel();
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. 1 universe: `, universe);
            if (universeData) {
                universe.parseUniverseData(universeData);
            }
            console.log(`${logLabel} useUniversesStore().useAsyncData callback. 2 universe: `, universe);
            return { universe, universes };
        });
        console.log(`${logLabel} useUniversesStore().setup() data: `, data);

        return data;
    }
);
