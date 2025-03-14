
import { Schema, model } from 'mongoose';
import {ClusterDocumentInterface, ClusterDocumentSchema} from "~/server/models/ClusterDocument";

export interface UniverseDocumentInterface {
    schemaVersion: string;
    id: string;
    description: string;
    currentClusterId: string;
    clusters: Array<ClusterDocumentInterface>;
}

export const UniverseDocumentSchema
  = new Schema<UniverseDocumentInterface>({
    schemaVersion: { type: String, required: true },
    id: { type: String, required: true },
    description: { type: String, required: true },
    currentClusterId: { type: String, required: true },
    clusters: { type: [ClusterDocumentSchema]}
});

export const UniverseDocument
  = model<UniverseDocumentInterface>("UniverseDocument", UniverseDocumentSchema);

