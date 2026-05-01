import {
  type ClusterModelInterface, type ClustersModelInterface,
  DEFAULT_GALACTIC_DIRECTION,
  galacticDirectionOpposites,
  type GalacticDirectionType
} from "~/types/ClusterTypes";
import createGraph, {type Graph, type Node} from "ngraph.graph";
import createLayout, {type Layout} from "ngraph.forcelayout";
import type {StraitModelInterface} from "~/types/StraitTypes";
import type {EventedType} from "ngraph.events";

export type PositionedObjectType<T> = {
  id: string;
  data: T;
  position: PointType;
}

export type ClusterStraitPosition = {
  id: string;
  fromCluster: ClusterModelInterface;
  toCluster: ClusterModelInterface;
  fromPosition: PointType;
  toPosition: PointType;
  galacticDirection: GalacticDirectionType;
  strait: StraitModelInterface;
}

export type FinishedCallback = (iteration: number) => boolean;

export type LayoutServiceOptionsType = {
  iterations: number;
  finished?: FinishedCallback;
  physicsSettings?: Partial<{
    timeStep: number,
    dimensions: number,
    gravity: number,
    theta: number,
    springLength: number,
    springCoefficient: number,
    dragCoefficient: number,
  }>,
  padding?: PointType
}

export type LayoutBoundingBox = {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

const DEFAULT_LAYOUT_OPTIONS: Pick<LayoutServiceOptionsType, "iterations" | "padding"> = {
  iterations: 100,
  padding: {x: 80, y: 60}
} as const;
const MAX_ITERATIONS = 10000;

const SCALE_TO_VIEWBOX = {
  x: 0,
  y: 0,
  width: 1000,
  height: 750,
}

export class LayoutService {

  clusters: ClusterModelInterface[];
  straits: StraitModelInterface[];

  graph: Graph<ClusterModelInterface, StraitModelInterface>;
  layout: Layout<Graph<ClusterModelInterface, StraitModelInterface>> & EventedType
  options: LayoutServiceOptionsType;
  _layoutViewBox: ViewBoxType | undefined;

  constructor(
      clusters: ClustersModelInterface,
      options?: LayoutServiceOptionsType
  ) {
    this.clusters = clusters.clusters;
    this.straits = clusters.getClusterStraits();
    this.options = Object.assign(DEFAULT_LAYOUT_OPTIONS, options)
    this.graph = this.initGraph();
    this.layout = createLayout(this.graph, this.options?.physicsSettings);
    console.log('LayoutService.constructor() this', this);
    this.setInitialClusterPositions();
    this.initLayout()
  }

  get viewBox(): ViewBoxType | undefined {
    return this._layoutViewBox
  }

  initGraph() {
    this.graph = createGraph<ClusterModelInterface, StraitModelInterface>();
    this.clusters.forEach(cluster => {
      this.graph.addNode(cluster.id, cluster);
    })
    this.straits.forEach(strait => {
      this.graph.addLink(strait.straitPointA.cluster.id, strait.straitPointB.cluster.id, strait);
    })
    return this.graph;
  }

  setInitialClusterPositions() {
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
      console.log('LayoutService.handleStraits() cluster.id, position', cluster.id, position);
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

  initLayout() {
    console.group('LayoutService.initLayout()')

    console.log('initLayout() this.options: ', this.options)
    for (let i = 0; !this.stepsDone(i); i++) {
      this.layout.step();
    }

    this.translateAndScale();

    this._layoutViewBox = this.calcViewBox();
    this.graph.forEachNode((n) => {
      const pos = this.layout.getNodePosition(n.id);
      console.log(n.id, pos)
    })
    console.log('initLayout() finished.')
    console.groupEnd();
  }

  stepsDone(i: number) {
    if (typeof this.options.finished !== 'undefined') {
      return i >= MAX_ITERATIONS || this.options.finished(i);
    }
    return i >= this.options.iterations;
  }

  * clusterPositions() {
    for (let cluster of this.clusters) {
      const positionVector = this.layout.getNodePosition(cluster.id)
      const {x, y} = positionVector;
      yield {
        id: cluster.id,
        cluster,
        position: {x: fround(x), y: fround(y)}
      }
    }
  }

  * straitPositions() {
    console.group('straitPositions()');
    for (let strait of this.straits) {
      const {
        id,
        straitPointA: {
          cluster: fromCluster,
        },
        straitPointB: {
          cluster: toCluster
        },
        galacticDirection
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
            galacticDirection,
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

  _layoutBBToViewBox(bb: LayoutBoundingBox): ViewBoxType {
    return {
      x: bb.min_x,
      y: bb.min_y,
      width: bb.max_x - bb.min_x,
      height: bb.max_y - bb.min_y,
    }
  }

  translateAndScale() {

    const bb = this.layout.getGraphRect() as any as LayoutBoundingBox;
    const layoutViewBox = this.calcViewBox();
    console.log('this._layoutViewBox: ', this._layoutViewBox);

    const width = layoutViewBox.width;
    const height = layoutViewBox.height;
    const horizCenter = layoutViewBox.width / 2;
    const vertCenter = layoutViewBox.height / 2;

    const translateX = (bb.min_x + horizCenter);
    const translateY = (bb.max_y + vertCenter);
    const scaleX = SCALE_TO_VIEWBOX.width / width;
    const scaleY = SCALE_TO_VIEWBOX.height / height;

    this.graph.forEachNode(node => {
      const currNodePos = this.layout.getNodePosition(node.id);
      const x = (currNodePos.x + translateX) * scaleX;
      const y = (currNodePos.y + translateY) * scaleY;
      this.layout.setNodePosition(node.id, x, y);
      console.log('after translate and scale: ', node.id, this.layout.getNodePosition(node.id))
    })
    this.clusters.forEach(({id}) => console.log(id, this.layout.getNodePosition(id)))
  }

  calcViewBox() {
    const bb = this.layout.getGraphRect() as any as LayoutBoundingBox;
    console.log('calcViewBox(): bb', bb);
    const PADDING_X = this.options?.padding?.x ?? (DEFAULT_LAYOUT_OPTIONS.padding?.x || 80);
    const PADDING_Y = this.options?.padding?.y ?? (DEFAULT_LAYOUT_OPTIONS.padding?.y || 60);
    const newViewBox = {
      x: bb.min_x - PADDING_X,
      y: bb.min_y - PADDING_Y,
      width: bb.max_x - bb.min_x + PADDING_X * 2,
      height: bb.max_y - bb.min_y + PADDING_Y * 2,
    }
    console.log('calcViewBox(): newViewBox', newViewBox);
    return newViewBox;
  }

}