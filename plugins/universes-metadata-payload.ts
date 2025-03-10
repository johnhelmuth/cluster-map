import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";

export default definePayloadPlugin((nuxtApp) => {
    // "Reduce" the payload on the server - i.e. take a ClustersModel and return a JSON string.
    definePayloadReducer('UniversesMetadataModel', data => {
        if (data instanceof UniversesMetadataModel) {
            return JSON.stringify(data);
        }
        return false;
    })

    // "Revive" the payload on the client - i.e. take a JSON string and return a ClustersModel.
    definePayloadReviver('UniversesMetadataModel', (data) => {
        let universesMetadataModel;
        try {
            universesMetadataModel = JSON.parse(data);
        } catch (error) {
            console.error('ClustersModel.revivers JSON parse error: ', error)
        }
        if (universesMetadataModel) {
            return new UniversesMetadataModel(universesMetadataModel);
        }
    })
});