import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";

export default definePayloadPlugin((nuxtApp) => {
    // "Reduce" the payload on the server - i.e. take a ClustersModel and return a JSON string.
    definePayloadReducer('UniversesMetadataModel', data => {
        if (data instanceof UniversesMetadataModel) {
            return JSON.stringify(data);
        }
        return false;
    })

    // "Revive" the payload on the client - i.e. take a JSON string and return a UniversesMetadataModel.
    definePayloadReviver('UniversesMetadataModel', (data) => {
        let universesMetadataModelPOJO;
        try {
            universesMetadataModelPOJO = JSON.parse(data);
        } catch (error) {
            console.error('ClustersModel.revivers JSON parse error: ', error)
        }
        if (universesMetadataModelPOJO) {
            return new UniversesMetadataModel(universesMetadataModelPOJO);
        }
    })
});