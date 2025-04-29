import {Document, WithId} from "mongodb";
import {ClusterModelData} from "~/models/ClusterModel";
import {SystemModelData} from "~/models/SystemModel";
import {StraitModelData} from "~/models/StraitModel";
import {SystemDataDocumentToSystemModelData, SystemDataDocument} from "~/server/document-models/SystemDataDocument";
import {StraitDataDocumentToStraitModelData, StraitDataDocument} from "~/server/document-models/StraitDataDocument";


export interface ClusterDataDocument extends WithId<Document> {
  schemaVersion: string;
  type: 'cluster';
  name: string;
  systems: Array<SystemDataDocument>;
  straits: Array<StraitDataDocument>;
}

export function isClusterDataDocument(data: any): data is ClusterDataDocument {
  // TODO implement this.
  return true;
}

export function ClusterDataDocumentToClusterModelData(cluster: ClusterDataDocument) {
  if (isClusterDataDocument(cluster)) {
    const clusterData = {
      type: cluster.type,
      schemaVersion: cluster.schemaVersion,
      id: cluster._id.toHexString(),
      name: cluster.name,
      systems: [],
      straits: [],
    } as ClusterModelData;
    const systems = cluster.systems.map(SystemDataDocumentToSystemModelData).filter(system => !! system) as Array<SystemModelData>;
    const straits = cluster.straits.map(StraitDataDocumentToStraitModelData).filter(strait => !! strait) as Array<StraitModelData>;
    if (systems?.length > 0) {
      clusterData.systems = systems;
    }
    if (straits.length > 0) {
      clusterData.straits = straits;
    }
    return clusterData;
  }
}