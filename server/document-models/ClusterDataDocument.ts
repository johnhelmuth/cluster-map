import {Document, ObjectId, WithId} from "mongodb";
import {ClusterModelData} from "~/models/ClusterModel";
import {SystemModelData} from "~/models/SystemModel";
import {StraitModelData} from "~/models/StraitModel";
import {SystemDataDocument} from "~/server/document-models/SystemDataDocument";
import {StraitDataDocument} from "~/server/document-models/StraitDataDocument";
import {SCHEMA_VERSION} from "~/constants";

export interface ClusterDataDocumentInterface extends WithId<Document> {
  schemaVersion: string;
  type: 'cluster';
  name: string;
  systems: Array<SystemDataDocument>;
  straits: Array<StraitDataDocument>;
}

export class ClusterDataDocument implements ClusterDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion: string = SCHEMA_VERSION;
  type: 'cluster' = 'cluster';
  name: string = 'Unknown cluster';
  systems: Array<SystemDataDocument> = [];
  straits: Array<StraitDataDocument> = [];

  constructor(data: any) {
    if (ClusterDataDocument.isClusterDataDocument(data)) {
      this._id = data._id;
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.name = data.name;
      this.systems = data.systems;
      this.straits = data.straits;
    }
  }

  static isClusterDataDocument(data: any): this is ClusterDataDocumentInterface {
    // TODO implement this.
    return true;
  }

  toModelData(): ClusterModelData | undefined {
    const clusterData = {
      type: this.type,
      schemaVersion: this.schemaVersion,
      id: this._id.toHexString(),
      name: this.name,
      systems: [],
      straits: [],
    } as ClusterModelData;
    const systems = this.systems
      .map(systemData => SystemDataDocument.create(systemData).toModelData())
      .filter(system => !! system) as Array<SystemModelData>;
    const straits = this.straits
      .map(straitData => StraitDataDocument.create(straitData).toModelData())
      .filter(strait => !! strait) as Array<StraitModelData>;
    if (systems?.length > 0) {
      clusterData.systems = systems;
    }
    if (straits.length > 0) {
      clusterData.straits = straits;
    }
    return clusterData;
  }

  static create(data: any): ClusterDataDocument {
    return new ClusterDataDocument(data);
  }
}
