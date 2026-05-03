import {
  type ClusterModelInterface, type ClustersModelInterface,
  DEFAULT_GALACTIC_DIRECTION,
  galacticDirectionOpposites,
  type GalacticDirectionType
} from "~/types/ClusterTypes";
import type {StraitModelInterface} from "~/types/StraitTypes";
import {LayoutServiceBase} from "~/utils/LayoutServiceBase";

export type ClusterStraitPosition = {
  id: string;
  fromCluster: ClusterModelInterface;
  toCluster: ClusterModelInterface;
  fromPosition: PointType;
  toPosition: PointType;
  strait: StraitModelInterface;
}

export class LayoutClustersService extends LayoutServiceBase<ClusterModelInterface, StraitModelInterface, ClusterStraitPosition> {

  clusters: ClusterModelInterface[];
  straits: StraitModelInterface[];

  constructor(
      clusters: ClustersModelInterface,
      options?: LayoutServiceOptionsType
  ) {
    super(options);
    this.clusters = clusters.clusters;
    this.straits = clusters.getClusterStraits();
    console.log('LayoutClustersService.constructor() this', this);
    this.startLayout();
  }

  addNodes() {
    this.clusters.forEach(cluster => {
      this.graph.addNode(cluster.id, cluster);
    })
  }

  addLinks() {
    this.straits.forEach(strait => {
      this.graph.addLink(strait.straitPointA.cluster.id, strait.straitPointB.cluster.id, strait);
    })
  }

  setInitialPositions() {
    /*
     * Set the first cluster at (0,0)
     * Use the direction of each link from that cluster to set the position of the linked
     * cluster to the (0,1), (1,0), (0,-1), or (-1,0) relative to the first cluster.
     *
     * repeat for each of the other clusters.
     */

    if (this.clusters.length > 0) {
      const position = {
        x: 0,
        y: 0,
      }
      const cluster = this.clusters[0];
      if (typeof cluster !== "undefined") {
        const positionedClusters = new Map<string, ClusterModelInterface>()
        const positionsUsed = new Set<string>();
        this.handleStraits(cluster, position,
            positionedClusters,
            positionsUsed,
            0
        )
        this.clusters.forEach(({id}) => console.log(id, this.layout.getNodePosition(id)))
      }
    }
  }

  handleStraits(
      cluster: ClusterModelInterface,
      position: PointType,
      posClusters: Map<string, ClusterModelInterface>,
      positionsUsed: Set<string>,
      depth: number
  ) {
    console.group(`handleStraits() ${depth}`)
    if (!posClusters.has(cluster.id)) {
      console.log('LayoutClustersService.handleStraits() cluster.id, position', cluster.id, position);
      posClusters.set(cluster.id, cluster);
      positionsUsed.add(JSON.stringify(position));
      this.layout.setNodePosition(cluster.id, position.x, position.y);
      const straits = cluster.getClusterStraits();
      if (typeof straits !== "undefined") {
        straits.forEach(strait => {
          const otherCluster = strait.getOtherCluster(cluster);
          if (typeof otherCluster !== 'undefined') {
            if (!posClusters.has(otherCluster.id)) {
              let galacticDirection = strait.galacticDirection || DEFAULT_GALACTIC_DIRECTION;
              if (!strait.straitOriginInCluster(cluster)) {
                if (typeof strait.galacticDirection !== 'undefined') {
                  galacticDirection = galacticDirectionOpposites[strait.galacticDirection];
                } else {
                  galacticDirection = DEFAULT_GALACTIC_DIRECTION;
                }
              }
              const newPosition = this.getRelativePosition(position, otherCluster, galacticDirection, positionsUsed)
              console.log('positionsUsed', positionsUsed)
              if (typeof newPosition !== "undefined") {
                this.handleStraits(otherCluster, newPosition, posClusters, positionsUsed, depth + 1);
              }
            }
          }
        })
      }
      console.groupEnd();
    }
    console.groupEnd();
  }

  getRelativePosition(
      position: PointType,
      otherCluster: ClusterModelInterface,
      galacticDirection: GalacticDirectionType,
      positionsUsed: Set<string>
  ) {
    console.log('getRelativePositionedObject() position: ', position);
    console.log('getRelativePositionedObject() otherCluster.id: ', otherCluster.id);
    console.log('getRelativePositionedObject() galacticDirection: ', galacticDirection);
    if (typeof otherCluster !== 'undefined') {
      let otherPos = Object.assign({}, position);
      while (typeof otherPos === 'undefined' || positionsUsed.has(JSON.stringify(otherPos))) {
        if (typeof otherPos === 'undefined') {
          otherPos = Object.assign({}, position);
        }
        switch (galacticDirection) {
          case 'coreward':
            otherPos.y -= 1;
            break;
          case 'spinward':
            otherPos.x += 1;
            break;
          case 'counterspinward':
            otherPos.x -= 1;
            break;
          case 'rimward':
          default:
            otherPos.y += 1;
            break;
        }
      }
      positionsUsed.add(JSON.stringify(otherPos));
      return otherPos
    }
  }

  * nodePositions() {
    for (let cluster of this.clusters) {
      const positionVector = this.layout.getNodePosition(cluster.id)
      const {x, y} = positionVector;
      yield {
        id: cluster.id,
        data: cluster,
        position: {x: fround(x), y: fround(y)}
      }
    }
  }

  * linkPositions() {
    console.group('linkPositions()');
    for (let strait of this.straits) {
      const {
        id,
        straitPointA: {
          cluster: fromCluster,
        },
        straitPointB: {
          cluster: toCluster
        }
      } = strait;
      const link = this.graph.getLink(fromCluster.id, toCluster.id);
      console.log('link', link);
      if (typeof link !== 'undefined') {
        const linkPosition = this.layout.getLinkPosition(link.id);
        console.log('linkPosition', linkPosition);
        if (typeof linkPosition !== 'undefined') {
          yield {
            id,
            fromCluster,
            toCluster,
            fromPosition: {
              x: fround(linkPosition.from.x),
              y: fround(linkPosition.from.y)
            },
            toPosition: {
              x: fround(linkPosition.to.x),
              y: fround(linkPosition.to.y)
            },
            strait
          } as ClusterStraitPosition
        }
      }
    }
    console.groupEnd();
  }

}