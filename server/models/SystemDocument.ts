
import { Schema, model } from 'mongoose';
import {SystemAttributesInterface} from "~/types/SystemTypes";
import {PointType} from "~/types/GeometryTypes";
import type {AspectType} from "~/types/BasicTypes";

export interface SystemDocumentInterface {
    schemaVersion: string;
    id: string;
    name: string;
    url: string;
    attributes: SystemAttributesInterface,
    aspects: Array<AspectType>,
    position: PointType,
}

const AttributesDocumentModelSchema = new Schema<SystemAttributesInterface>({
    technology: { type: Number, min: -4, max: 4, required: true },
    environment: { type: Number, min: -4, max: 4, required: true },
    resources: { type: Number, min: -4, max: 4, required: true },
});

const PositionDocumentModelSchema = new Schema<PointType>({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number },
})

const SystemDocumentSchema
  = new Schema<SystemDocumentInterface>({
    schemaVersion: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    attributes: { type: AttributesDocumentModelSchema, required: true},
    aspects: { type: [String], required: true },
    position: { type: PositionDocumentModelSchema, required: true },
})

export const SystemDocument
  = model<SystemDocumentInterface>("SystemDocument", SystemDocumentSchema);