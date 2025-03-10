import {UniverseModel} from "~/models/UniverseModel";

export default definePayloadPlugin((nuxtApp) => {
    // "Reduce" the payload on the server - i.e. take a ClustersModel and return a JSON string.
    definePayloadReducer('UniverseModel', data => {
        if (data instanceof UniverseModel) {
            return JSON.stringify(data);
        }
        return false;
    })

    // "Revive" the payload on the client - i.e. take a JSON string and return a ClustersModel.
    definePayloadReviver('UniverseModel', (data) => {
        let universeModel;
        try {
            universeModel = JSON.parse(data);
        } catch (error) {
            console.error('ClustersModel.revivers JSON parse error: ', error)
        }
        if (universeModel) {
            return new UniverseModel(universeModel);
        }
    })
});