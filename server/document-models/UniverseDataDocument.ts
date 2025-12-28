import {Document, ObjectId, WithId} from "mongodb";
import {ClusterDataDocument} from "~/server/document-models/ClusterDataDocument";
import {UniverseMetadataData} from "~/models/UniversesManager";
import {UniverseIdType, UniverseModelData} from "~/models/UniverseModel";
import {ClusterModelData} from "~/models/ClusterModel";
import {SCHEMA_VERSION} from "~/constants";
import { universesCollection } from '~/server/utils/DataSourceDb';
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import universeMongoSchema from '~/server/data/db-schemas/mongo-universe.schema.json';

export interface UniverseDataDocumentInterface extends WithId<Document> {
  schemaVersion: string;
  type: 'universe';
  name: string;
  currentClusterId: ObjectId | undefined;
  clusters: Array<ClusterDataDocument>,
}

export class UniverseDataDocument implements UniverseDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'universe' = 'universe';
  name: string = 'Unknown Universe';
  currentClusterId: ObjectId | undefined = undefined;
  clusters: Array<ClusterDataDocument> = [];

  constructor(data: any) {
    if (UniverseDataDocument.isUniverseDataDocument(data)) {
      this._id = data._id;
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.name = data.name;
      this.currentClusterId = data.currentClusterId;
      this.clusters = data.clusters;
    }
  }

  static isUniverseDataDocument(data: any): data is UniverseDataDocumentInterface {
    // TODO implement this.
    return true;
  }

  toModelData(): UniverseModelData | undefined {
    let clusters = [] as Array<ClusterModelData>;
    if (this.clusters?.length > 0) {
      clusters = this.clusters
        .map(clusterData => ClusterDataDocument.create(clusterData).toModelData())
        .filter(cluster => !!cluster) as Array<ClusterModelData>;
    }
    return {
      type: this.type,
      schemaVersion: this.schemaVersion,
      id: (this._id.toHexString()),
      name: (this.name || 'Unknown'),
      currentClusterId: this?.currentClusterId?.toHexString(),
      clusters
    } as UniverseModelData;
  }

  static create(data: any): UniverseDataDocument {
    return new UniverseDataDocument(data);
  }

  toUniverseMetadataData(): UniverseMetadataData {
    return {
      id: this._id.toHexString(),
      type: 'universeMetadata',
      schemaVersion: this.schemaVersion,
      name: this.name
    }
  }

  static async getUniverseData(universeId: UniverseIdType) {
    const universesData = await (await universesCollection())
      .aggregate(UniverseDataDocument.dataPipeline(universeId)).toArray() as UniverseDataDocument[];
    if (universesData) {
      const universeDataDocument = UniverseDataDocument.create(universesData[0]);
      return universeDataDocument.toModelData();
    }
  }

  static async getUniversesMetadataData() {
    const universeDataDocuments = await (await universesCollection()).find().toArray();

    const universesMetadataData = universeDataDocuments
      .map((universeDataDocumentData : UniverseDataDocumentInterface) => {
        const universeDataDocument = new UniverseDataDocument(universeDataDocumentData);
        if (!UniverseDataDocument.isUniverseDataDocument(universeDataDocument)) {
          const parsedResponse = universeMetadataParse(universeDataDocument);
          throw createSchemaValidationError(parsedResponse, 'DataSourceDb, invalid universeMetadataData. ');
        }
        return universeDataDocument.toUniverseMetadataData();
      });
    return universesMetadataData;
  }

  static dataPipeline(universeId : UniverseIdType) {
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

  static mongoSchemaValidator() {
    return universeMongoSchema
  }
}