import {Document, ObjectId} from "mongodb";


export interface StraitDataDocument extends Document {
  schemaVersion: string;
  type: 'strait';
  systems: Array<ObjectId>,
  direction: 'clockwise' | 'center' | 'counterclockwise'
}

export function isStraitDataDocument(data: any): data is StraitDataDocument {
  // TODO implement this.
  return true;
}

export function StraitDataDocumentToStraitModelData(data: StraitDataDocument) {
  if (isStraitDataDocument(data)) {
    return {
      ...data,
      systems: data.systems.map(systemId => systemId.toHexString()),
    }
  }
}