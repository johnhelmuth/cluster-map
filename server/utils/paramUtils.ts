/**
 * TODO make these use a database instead of pulling data from JSON files via ~/server/data/universesData.
 */

import {ClusterIdType, ClusterModelInterface, UniverseIdType, UniverseModelInterface} from "~/types/ClusterTypes";

import { universesData } from '~/server/data/universesData'
import {SystemIdType, SystemModelInterface} from "~/types/SystemTypes";
import {UniverseModel} from "~/models/UniverseModel";

const universes = new Map<UniverseIdType, UniverseModelInterface>();

export async function getUniverseData(universeId: UniverseIdType): Promise<UniverseModelInterface | undefined> {
    const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';

    console.log(`${logLabel}getUniverseData() universesData: `, universesData);
    console.log(`${logLabel}getUniverseData() universeId: `, universeId);

    if (universes.has(universeId)) {
        console.log(`${logLabel}getUniverseData() universes has "${universeId}", returning it.`);
        return universes.get(universeId);
    }
    console.log(`${logLabel}getUniverseData() universes does not have "${universeId}", pulling it in.`);

    const universeData = universesData.find((universeData) => universeData.id === universeId);
    if (universeData) {
        const universe = new UniverseModel(universeData);

        console.log(`${logLabel}getUniverseData() universe: `, universe);
        console.log(`${logLabel}getUniverseData() universeId: `, universeId)
        console.log(`${logLabel}getUniverseData() universe.id: `, universe.id)
        console.log(`${logLabel}getUniverseData() universeId === universe.id: `, universeId === universe.id)
        return universe;
    }
}

export async function getClusterData(universeId: UniverseIdType, clusterId: ClusterIdType): ClusterModelInterface | undefined {
    const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
    const universe = await getUniverseData(universeId);
    if (universe) {
        console.log(`${logLabel}getClusterData() clusterId: `, clusterId);
        const cluster = universe.getClusterById(clusterId);
        console.log(`${logLabel}getClusterData() clusterId: `, clusterId);
        return cluster;
    }
}

export async function getSystemData(universeId: UniverseIdType, clusterId: ClusterIdType, systemId: SystemIdType): SystemModelInterface | undefined {
    const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
    const cluster = await getClusterData(universeId, clusterId);
    if (cluster) {
        console.log(`${logLabel}getSystemData() systemId: `, systemId);
        const system = cluster.getSystemById(systemId);
        console.log(`${logLabel}getSystemData() system: `, system);
        return system;
    }
}
