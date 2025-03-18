import {
  ClusterDocument,
  ClusterDocumentInterface,
  StraitDocumentInterface,
  SystemDocumentInterface
} from "@/server/models/ClusterDocument";
import {universesData} from '~/server/data/universesData'
import {ClusterModel} from "~/models/ClusterModel";
import {ClusterModelDataType} from "~/types/ClusterTypes";
import {SystemModelDataType, SystemModelInterface} from "~/types/SystemTypes";
// @ts-ignore
import {mongoose} from "mongoose";
import {StraitModelDataType, StraitModelInterface} from "~/types/StraitTypes";

type IdsTo_IDsMapType = Map<string, typeof mongoose.Types.ObjectId>;

function mapSystemIdsToObjectIds(systems: SystemModelDataType[]) : { idsToObjectIds: IdsTo_IDsMapType, systemDocuments: Array<SystemDocumentInterface>} {
  const systemDocuments: Array<SystemDocumentInterface> = [];
  const idsToObjectIds =
    systems.reduce((idsMap, system) => {
      const objectId = new mongoose.Types.ObjectId();
      if (system?.id) {
        idsMap.set(system?.id, objectId);
        systemDocuments.push({...system, _id: objectId} as SystemDocumentInterface);
      }
      return idsMap;
    }, new Map<string, typeof mongoose.Types.ObjectId>());
  return { idsToObjectIds, systemDocuments };
}

async function clusterToModel(cluster: ClusterModelDataType) : Promise<[string, typeof ClusterDocument] | [string, Error] | undefined> {
  console.log('cluster.id: ', cluster.id);
  if (typeof cluster.id === 'string') {
    const systems = cluster.systems || [];
    const straits = (cluster.straits || []) as StraitModelDataType[];
    delete cluster.systems;
    delete cluster.straits;
    const clusterDocData = cluster as ClusterDocumentInterface;
    if (systems?.length) {
      const {idsToObjectIds, systemDocuments} = mapSystemIdsToObjectIds(systems);

      let straitsWith_ids: StraitDocumentInterface[] = [];
      if (straits?.length) {
        straitsWith_ids = straits.map((strait) => {
          const systems = strait.systems.map((systemId) => {
            return idsToObjectIds.get(systemId) as string | undefined;
          }).filter(systemId => systemId);
          if (systems.length === 2) {
            strait.systems = systems as string[];
          }
          return strait as StraitDocumentInterface;
        });
      }
      clusterDocData.systems = systemDocuments;
      clusterDocData.straits = straitsWith_ids;
    }
    const clusterDocument = new ClusterDocument(clusterDocData);
    try {
      await clusterDocument.save();
    } catch (error) {
      return [cluster?.id || 'UNKNOWN', error as Error];
    }
    return [cluster.id || 'UNKNOWN', clusterDocument];
  }
}

export default defineEventHandler(
  async (event) => {
    const universeClusters = universesData[0].clusters;
    const clusterModelResults = await Promise.all(
      universeClusters.map(clusterToModel)
    );
    const errors = new Map<string, Error>();
    const clusterModels = clusterModelResults.map((elem) => {
      if (elem) {
        const [clusterId, cOrE] = elem;
        if (clusterId && cOrE) {
          if (cOrE instanceof ClusterDocument) {
            return cOrE;
          } else {
            errors.set(clusterId, cOrE);
          }
        }
      }
    }).filter((elem) => elem);
    console.log('clusterModelResults: ', clusterModelResults);
    const responseObj = {
      clusterModels
    } as  {
      clusterModels : ClusterModel[],
      errors?: [string,Error][];
    };
    if (errors.size) {
      responseObj.errors = [...errors];
    }
    return responseObj;
  }
)