
import { Schema, model } from 'mongoose';
import {SystemDocumentInterface, SystemDocumentSchema} from './SystemDocument';
import {StraitDocumentInterface, StraitDocumentSchema} from './StraitDocument';

export interface ClusterDocumentInterface {
    schemaVersion: string;
    id: string;
    name: string;
    systems?: Array<SystemDocumentInterface>,
    straits?: Array<StraitDocumentInterface>
}

export const ClusterDocumentSchema
  = new Schema<ClusterDocumentInterface>({
        schemaVersion: { type: String, required: true },
        id: { type: String, required: true },
        name: { type: String, required: true },
        systems: { type: [SystemDocumentSchema] },
        straits: { type: [StraitDocumentSchema] },
    });

export const ClusterDocument
  = model<ClusterDocumentInterface>("ClusterDocument", ClusterDocumentSchema);
