/**
 * TODO make these use a database instead of pulling data from JSON files via ~/server/data/universesData.
 */

import {ClusterIdType, ClusterModelInterface, UniverseIdType, UniverseModelInterface} from "~/types/ClusterTypes";

import {universesData} from '~/server/data/universesData'
import {SystemIdType, SystemModelInterface} from "~/types/SystemTypes";
import {UniverseModel} from "~/models/UniverseModel";

const universes = new Map<UniverseIdType, UniverseModelInterface>();

export async function getUniverseData(universeId: UniverseIdType): Promise<UniverseModelInterface | undefined> {

  if (universes.has(universeId)) {
    return universes.get(universeId);
  }

  const universeData = universesData.find((universeData) => universeData.id === universeId);
  if (universeData) {
    return new UniverseModel(universeData);
  }
}

export async function getClusterData(universeId: UniverseIdType, clusterId: ClusterIdType): Promise<ClusterModelInterface | undefined> {
  const universe = await getUniverseData(universeId);
  if (universe) {
    return universe.getClusterById(clusterId);
  }
}

export async function getSystemData(universeId: UniverseIdType, clusterId: ClusterIdType, systemId: SystemIdType): Promise<SystemModelInterface | null | undefined> {
  const cluster = await getClusterData(universeId, clusterId);
  if (cluster) {
    return cluster.getSystemById(systemId);
  }
}

export function checkUniverseId(universeId: UniverseIdType|string|undefined) : universeId is UniverseIdType {
  return !! universeId;
}

export function checkClusterId(clusterId: ClusterIdType|string|undefined) : clusterId is ClusterIdType {
  return !! clusterId;
}

export function checkSystemId(systemId: SystemIdType|string|undefined) : systemId is SystemIdType {
  return !! systemId;
}

export function checkUniverseExists(universe : UniverseModelInterface | undefined): universe is UniverseModelInterface {
  return !! universe;
}

export function checkClusterExists(cluster : ClusterModelInterface | undefined): cluster is ClusterModelInterface {
  return !! cluster;
}

export function checkSystemExists(system : SystemModelInterface | undefined | null): system is SystemModelInterface {
  return !! system;
}

export function throwError(status: number, msg: string): void {
  throw createError({
    statusCode: status,
    statusMessage: msg,
  });
}