
import { Schema, model } from 'mongoose';
import type {DrawDirectionType} from "~/types/StraitTypes";

export interface StraitDocumentInterface {
    schemaVersion: string;
    systems: Array<string>;
    direction?: DrawDirectionType;
}

const StraitDocumentModelSchema
    = new Schema<StraitDocumentInterface>({
    schemaVersion: { type: String, required: true },
    systems: { type: Schema.Types.Array, required: true },
    direction: { type: String },
});

export const StraitDocument = model<StraitDocumentInterface>("StraitDocument", SystemDocumentModelSchema);