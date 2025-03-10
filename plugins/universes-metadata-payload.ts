import {UniversesMetadataModel} from "~/models/UniversesMetadataModel";

export default definePayloadPlugin((nuxtApp) => {
    // "Reduce" the payload on the server - i.e. take a ClustersModel and return a JSON string.
    definePayloadReducer('UniversesMetadataModel', data => {
        if (data instanceof UniversesMetadataModel) {
            console.log('defaultPayloadReducer(UniversesMetadataModel) called with data (should be a UniversesMetadataModel): ', data);
            const reducedUniversesMetaData = JSON.stringify(data);
            console.log('defaultPayloadReducer(UniversesMetadataModel) returning reducedUniversesMetaData: ', reducedUniversesMetaData);
            return reducedUniversesMetaData;
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