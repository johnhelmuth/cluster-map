
import { Schema, model } from 'mongoose';
import type {DrawDirectionType} from "~/types/StraitTypes";
import {SystemIdType} from "~/types/SystemTypes";

export interface StraitDocumentInterface {
    schemaVersion: string;
    systems: Array<SystemIdType>;
    direction?: DrawDirectionType;
}

export const StraitDocumentSchema
  = new Schema<StraitDocumentInterface>({
    schemaVersion: { type: String, required: true },
    systems: { type: [String], required: true },
    direction: { type: String },
});

export const StraitDocument
  = model<StraitDocumentInterface>("StraitDocument", StraitDocumentSchema);