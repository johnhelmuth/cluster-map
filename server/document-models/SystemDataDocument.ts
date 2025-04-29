import {Document, WithId} from "mongodb";
import {SystemAttributesDefaults, SystemModelData} from "~/models/SystemModel";
import {isPointType} from "~/types/GeometryTypes";


export interface SystemDataDocument extends WithId<Document> {
  schemaVersion: string;
  type: 'system';
  name: string;
  attributes: {
    technology: number,
    environment: number,
    resources: number,
  },
  aspects: Array<string>,
  position: {
    x: number,
    y: number,
    z?: number
  }
}

export function isSystemDataDocument(data: any): data is SystemDataDocument {
  // TODO implement this.
  return true;
}

/**
 * Converts mongo document with system data into plain system data.
 *
 * @param data {SystemDataDocument}
 *
 * @return {SystemModelData}
 */
export function SystemDataDocumentToSystemModelData(data: SystemDataDocument) {
  if (isSystemDataDocument(data)) {
    const systemModelData = {
      type: data.type,
      schemaVersion: data.schemaVersion,
      id: (data._id.toHexString()),
      name: (data?.name || 'Unknown'),
      attributes: data?.attributes || SystemAttributesDefaults,
      aspects: data?.aspects || [],
    } as SystemModelData;
    if (isPointType(data.position)) {
      systemModelData.position = data.position
    }
    return systemModelData;
  }
}