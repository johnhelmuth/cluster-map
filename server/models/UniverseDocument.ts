
import { Schema } from 'mongoose';
// @ts-ignore
import {defineMongooseModel} from "#nuxt/mongoose";
// @ts-ignore
import {mongoose} from "mongoose";

export interface UniverseDocumentInterface {
    schemaVersion: string;
    id: string;
    description: string;
    currentClusterId: string;
    clusters: Array<mongoose.Types.ObjectId>;
}

export const UniverseDocumentSchema
  = new Schema<UniverseDocumentInterface>({
    schemaVersion: { type: String, required: true },
    id: { type: String, required: true },
    description: { type: String, required: true },
    currentClusterId: { type: String, required: true },
    clusters: { type: [mongoose.Types.ObjectId] }
});

export const UniverseDocument
  = defineMongooseModel<UniverseDocumentInterface>("UniverseDocument", UniverseDocumentSchema);
