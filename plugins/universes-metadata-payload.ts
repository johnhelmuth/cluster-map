import {UniversesMetaDataModel} from "~/models/UniversesMetaDataModel";

export default definePayloadPlugin((nuxtApp) => {
    // "Reduce" the payload on the server - i.e. take a ClustersModel and return a JSON string.
    definePayloadReducer('UniversesMetaDataModel', data => {
        if (data instanceof UniversesMetaDataModel) {
            console.log('defaultPayloadReducer(UniversesMetaDataModel) called with data (should be a UniversesMetaDataModel): ', data);
            const reducedUniversesMetaData = JSON.stringify(data);
            console.log('defaultPayloadReducer(UniversesMetaDataModel) returning reducedUniversesMetaData: ', reducedUniversesMetaData);
            return reducedUniversesMetaData;
        }
        return false;
    })

    // "Revive" the payload on the client - i.e. take a JSON string and return a ClustersModel.
    definePayloadReviver('UniversesMetaDataModel', (data) => {
        let universesMetaDataModel;
        try {
            universesMetaDataModel = JSON.parse(data);
        } catch (error) {
            console.error('ClustersModel.revivers JSON parse error: ', error)
        }
        if (universesMetaDataModel) {
            return new UniversesMetaDataModel(universesMetaDataModel);
        }
    })
});