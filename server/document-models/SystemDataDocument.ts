import {Document, ObjectId, WithId} from "mongodb";
import {SystemAttributesInterface, SystemAttributesDefaults, SystemModelData} from "~/models/SystemModel";
import {isPointType} from "~/types/GeometryTypes";
import {SCHEMA_VERSION} from "~/constants";

export class SystemDataDocument implements Omit<SystemModelData, "id">, WithId<Document> {
  _id = new ObjectId();
  schemaVersion: string = SCHEMA_VERSION;
  type: 'system' = 'system';
  name: string = 'Unknown system';
  url?: string;
  attributes: SystemAttributesInterface = {
    technology: 0,
    environment: 0,
    resources: 0,
  };
  aspects: Array<string> = [];
  position: {
    x : number,
    y : number,
    z?: number
  } = {
    x: 500,
    y: 500
  }

  constructor(data: any) {
    if (SystemDataDocument.isSystemDataDocument(data)) {
      this._id = data._id;
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.name = data.name;
      if (data?.url) {
        this.url = data?.url;
      }
      this.attributes = data.attributes;
      this.aspects = data.aspects;
      this.position = data.position;
    }
  }

  toModelData() {
    const systemModelData = {
      type: this.type,
      schemaVersion: this.schemaVersion,
      id: (this._id.toHexString()),
      name: (this?.name || 'Unknown'),
      attributes: this?.attributes || SystemAttributesDefaults,
      aspects: this?.aspects || [],
    } as SystemModelData;
    if (typeof this?.url === 'string') {
      systemModelData.url = this.url;
    }
    if (isPointType(this.position)) {
      systemModelData.position = this.position
    }
    return systemModelData;
  }

  static create(data: any): SystemDataDocument {
    return new SystemDataDocument(data);
  }

  static isSystemDataDocument(data: any): data is SystemDataDocument {
    // TODO implement this.
    return true;
  }

}