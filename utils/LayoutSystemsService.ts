import {LayoutServiceBase} from "~/utils/LayoutServiceBase";
import type {ClusterModelInterface} from "~/types/ClusterTypes";
import type {StraitModelInterface} from "~/types/StraitTypes";
import type {SystemModelInterface} from "~/types/SystemTypes";
import type {MapViewStylesType} from "~/types/BasicTypes";

export type StraitPosition = {
  id: string;
  fromSystem: SystemModelInterface;
  toSystem: SystemModelInterface;
  fromPosition: PointType;
  toPosition: PointType;
  strait: StraitModelInterface;
}

export class LayoutSystemsService extends LayoutServiceBase<SystemModelInterface, StraitModelInterface, StraitPosition> {

  cluster: ClusterModelInterface;
  mapStyle: MapViewStylesType;
  rotateCluster: boolean;

  constructor(cluster: ClusterModelInterface, mapStyle: MapViewStylesType, rotateCluster: boolean, options?: LayoutServiceOptionsType) {
    super(options);
    this.cluster = cluster;
    this.mapStyle = mapStyle;
    this.rotateCluster = rotateCluster;
    console.log('LayoutSystemsService.constructor() this', this);
    this.startLayout();
  }

  addNodes() {
    this.cluster.getSystemsMap().values().forEach(system => {
      this.graph.addNode(system.id, system);
    })
  }

  addLinks() {
    this.cluster.getSystemsMap().values().forEach(system => {
      this.cluster.getStraitsBySystem(system).forEach(strait => {
        this.graph.addLink(strait.straitPointA.system.id, strait.straitPointB.system.id, strait)
      })
    })
  }

  setInitialPositions() {
    this.cluster.getSystemsMap().values().forEach(system => {
      const position = system.getPosition(this.mapStyle, this.rotateCluster);
      this.layout.setNodePosition(system.id, position.x, position.y);
    })
  }

  * nodePositions() {
    for (let system of this.cluster.getSystemsMap().values()) {
      const positionVector = this.layout.getNodePosition(system.id)
      const {x, y} = positionVector;
      yield {
        id: system.id,
        data: system,
        position: {x: fround(x), y: fround(y)}
      }
    }
  }

  * linkPositions() {
    console.group('linkPositions()');
    for (let [, straits] of this.cluster.getStraitsInSystemOrder()) {
      for (let strait of straits) {
        const {
          id,
          straitPointA: {
            system: fromSystem,
          },
          straitPointB: {
            system: toSystem
          }
        } = strait;
        const link = this.graph.getLink(fromSystem.id, toSystem.id);
        console.log('link', link);
        if (typeof link !== 'undefined') {
          const linkPosition = this.layout.getLinkPosition(link.id);
          console.log('linkPosition', linkPosition);
          if (typeof linkPosition !== 'undefined') {
            yield {
              id,
              fromSystem,
              toSystem,
              fromPosition: {
                x: fround(linkPosition.from.x),
                y: fround(linkPosition.from.y)
              },
              toPosition: {
                x: fround(linkPosition.to.x),
                y: fround(linkPosition.to.y)
              },
              strait
            } as StraitPosition
          }
        }
      }
    }
    console.groupEnd();
  }
}
