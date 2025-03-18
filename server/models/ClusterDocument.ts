import {Schema} from 'mongoose';
import type {AspectType} from "~/types/BasicTypes";
import type {PointType} from "~/types/GeometryTypes";
import type {DrawDirectionType} from "~/types/StraitTypes";
import type {SystemAttributesInterface, SystemIdType} from "~/types/SystemTypes";
// @ts-ignore
import {defineMongooseModel} from "#nuxt/mongoose";
// @ts-ignore
import {mongoose} from "mongoose";

export interface SystemDocumentInterface {
  _id: mongoose.Types.ObjectId;
  id: SystemIdType;
  schemaVersion: string;
  name: string;
  url: string;
  attributes: SystemAttributesInterface,
  aspects: Array<AspectType>,
  position: PointType,
}

export const AttributesDocumentSchema = new Schema<SystemAttributesInterface>({
  technology: {type: Number, min: -4, max: 4, required: true},
  environment: {type: Number, min: -4, max: 4, required: true},
  resources: {type: Number, min: -4, max: 4, required: true},
}, { _id: false });

export const PositionDocumentSchema = new Schema<PointType>({
  x: {type: Number, required: true},
  y: {type: Number, required: true},
  z: {type: Number},
}, { _id: false });

export const SystemDocumentSchema
  = new Schema<SystemDocumentInterface>({
  schemaVersion: {type: String, required: true},
  name: {type: String, required: true},
  url: {type: String},
  attributes: {type: AttributesDocumentSchema, required: true},
  aspects: {type: [String], required: true},
  position: {type: PositionDocumentSchema, required: true},
});

export interface StraitDocumentInterface {
  schemaVersion: string;
  systems: Array<SystemIdType>;
  direction?: DrawDirectionType;
}

export const StraitDocumentSchema
  = new Schema<StraitDocumentInterface>(
      {
        schemaVersion: {type: String, required: true},
        systems: {type: [mongoose.Types.ObjectId], required: true},
        direction: {type: String, enum: ['clockwise', 'center', 'counterclockwise']},
      },
      {
        _id: false
      }
    );

export interface ClusterDocumentInterface {
  _id: mongoose.Types.ObjectId;
  schemaVersion: string;
  id: string;
  name: string;
  systems?: Array<SystemDocumentInterface>,
  straits?: Array<StraitDocumentInterface>
}

export const ClusterDocumentSchema
  = new Schema<ClusterDocumentInterface>({
  schemaVersion: {type: String, required: true},
  name: {type: String, required: true},
  systems: {type: [SystemDocumentSchema]},
  straits: {type: [StraitDocumentSchema]},
});

export const ClusterDocument
  = defineMongooseModel<ClusterDocumentInterface>("ClusterDocument", ClusterDocumentSchema);
