import {Document, ObjectId, WithId} from "mongodb";
import {ClusterDataDocument, ClusterDataDocumentToClusterModelData} from "~/server/document-models/ClusterDataDocument";
import {UniverseMetadataData} from "~/models/UniversesManager";
import {UniverseIdType, UniverseModelData} from "~/models/UniverseModel";
import {ClusterModelData} from "~/models/ClusterModel";

export interface UniverseDataDocument extends WithId<Document> {
  schemaVersion: string;
  type: 'universe';
  name: string;
  currentClusterId: ObjectId,
  clusters: Array<ClusterDataDocument>,
}

export function isUniverseDataDocument(data: any): data is UniverseDataDocument {
  // TODO implement this.
  return true;
}

/**
 * Converts mongo document with universe data into plain universe data with all the subdocuments filled in.
 *
 * @param data {UniverseDataDocument}
 *
 * @return {UniverseModelData}
 */
export function UniverseDataDocumentToUniverseModelData(data: UniverseDataDocument): UniverseModelData | undefined {
  if (isUniverseDataDocument(data)) {
    console.log('mongoUniverseDataToUniverseModelData() data: ', data);
    let clusters = [] as Array<ClusterModelData>;
    if (data.clusters?.length > 0) {
      clusters = data.clusters.map(ClusterDataDocumentToClusterModelData).filter(cluster => !! cluster) as Array<ClusterModelData>;
    }
    return {
      type: data.type,
      schemaVersion: data.schemaVersion,
      id: (data._id.toHexString()),
      name: (data?.name || 'Unknown'),
      currentClusterId: data.currentClusterId.toHexString(),
      clusters
    } as UniverseModelData;
  }
}

export function UniverseDataDocumentToUniverseMetadataData(universeData: UniverseDataDocument): UniverseMetadataData {
  return {
    id: universeData._id.toHexString(),
    type: 'universeMetadata',
    schemaVersion: universeData.schemaVersion.toString(),
    name: universeData.name
  }
}

export function universeDataPipeline(universeId: UniverseIdType) {
  return [{
    $match: {
      _id: {$eq: new ObjectId(universeId)}
    }
  }, {
    $lookup: {
      from: "clusters",
      let: {
        clusterIds: "$clusters",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$clusterIds"],
            },
          },
        },
        {
          $lookup: {
            from: "systems",
            let: {
              systemIds: "$systems",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$systemIds"],
                  },
                },
              },
            ],
            as: "systems",
          }
        }
      ],
      as: "clusters",
    }
  }]
}
