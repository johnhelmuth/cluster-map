import {Document, ObjectId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";

export interface StraitDataDocumentInterface extends Document {
  schemaVersion: string;
  type: 'strait';
  systems: Array<ObjectId>,
  direction: 'clockwise' | 'center' | 'counterclockwise'
}

export class StraitDataDocument implements StraitDataDocumentInterface {
  schemaVersion: string = SCHEMA_VERSION;
  type: 'strait' = 'strait';
  systems: Array<ObjectId> = [];
  direction: 'clockwise' | 'center' | 'counterclockwise' = 'center';

  constructor(data: any) {
    if (StraitDataDocument.isStraitDataDocument(data)) {
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.systems = data.systems;
      this.direction = data.direction;
    }
  }

  toModelData() {
    return {
      ...this,
      systems: this.systems.map(systemId => systemId.toHexString()),
    }
  }

  static create(data: any): StraitDataDocument {
    return new StraitDataDocument(data);
  }

  static isStraitDataDocument(data: any): data is StraitDataDocument {
    // TODO implement this.
    return true;
  }
}
