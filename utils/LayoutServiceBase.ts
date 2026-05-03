
import createGraph, {type Graph, type Node} from "ngraph.graph";
import createLayout, {type Layout} from "ngraph.forcelayout";
import type {EventedType} from "ngraph.events";

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

export abstract class LayoutServiceBase<NodeT, LinkT, LinkPosT> {

  graph: Graph<NodeT, LinkT>;
  layout: Layout<Graph<NodeT, LinkT>> & EventedType
  options: LayoutServiceOptionsType;
  _layoutViewBox: ViewBoxType | undefined;

  constructor(
      options?: LayoutServiceOptionsType
  ) {
    this.options = Object.assign(DEFAULT_LAYOUT_OPTIONS, options)
    this.graph = this.initGraph();
    this.layout = createLayout(this.graph, this.options?.physicsSettings);
    console.log('LayoutServiceBase.constructor() this', this);
  }

  startLayout() {
    this.addNodes();
    this.addLinks();
    this.setInitialPositions();
    this.initLayout()
  }

  get viewBox(): ViewBoxType | undefined {
    return this._layoutViewBox
  }

  initGraph() {
    this.graph = createGraph<NodeT, LinkT>();
    return this.graph;
  }

  abstract addNodes(): void;

  abstract addLinks(): void;

  abstract setInitialPositions(): void;

  initLayout() {
    console.group('LayoutServiceBase.initLayout()')

    console.log('this.options: ', this.options)
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

  abstract nodePositions(): Generator<{
    id: string,
    data: NodeT,
    position: { x: number, y: number }
  }, void, unknown>;

  abstract linkPositions(): Generator<LinkPosT, void, unknown>;

  translateAndScale() {

    const layoutViewBox = this.calcViewBox();
    console.log('this._layoutViewBox: ', this._layoutViewBox);
    this.graph.forEachNode(node => {
      console.log('before translate and scale: ', node.id, this.layout.getNodePosition(node.id))
    })

    const width = layoutViewBox.width;
    const height = layoutViewBox.height;
    const horizCenter = layoutViewBox.width / 2;
    const vertCenter = layoutViewBox.height / 2;

    const translateX = (horizCenter);
    const translateY = (vertCenter);
    const scaleX = SCALE_TO_VIEWBOX.width / width;
    const scaleY = SCALE_TO_VIEWBOX.height / height;
    console.log('SCALE_TO_VIEWBOX.width: ', SCALE_TO_VIEWBOX.width);
    console.log('width: ', width);
    console.log('SCALE_TO_VIEWBOX.height: ', SCALE_TO_VIEWBOX.height);
    console.log('height: ', height);
    console.log('translateX: ', translateX);
    console.log('translateY: ', translateY);
    console.log('scaleX: ', scaleX);
    console.log('scaleY: ', scaleY);
    this.graph.forEachNode(node => {
      const currNodePos = this.layout.getNodePosition(node.id);
      const x = (currNodePos.x + translateX) * scaleX;
      const y = (currNodePos.y + translateY) * scaleY;
      this.layout.setNodePosition(node.id, x, y);
      console.log('after translate and scale: ', node.id, this.layout.getNodePosition(node.id))
    })
  }

  calcViewBox() {
    const graphRect = this.layout.getGraphRect() as any as LayoutBoundingBox;
    console.log('calcViewBox(): graphRect', graphRect);
    const PADDING_X = this.options?.padding?.x ?? (DEFAULT_LAYOUT_OPTIONS.padding?.x || 80);
    const PADDING_Y = this.options?.padding?.y ?? (DEFAULT_LAYOUT_OPTIONS.padding?.y || 60);
    const newViewBox = {
      x: graphRect.min_x - PADDING_X,
      y: graphRect.min_y - PADDING_Y,
      width: graphRect.max_x - graphRect.min_x + PADDING_X * 2,
      height: graphRect.max_y - graphRect.min_y + PADDING_Y * 2,
    }
    console.log('calcViewBox(): newViewBox', newViewBox);
    return newViewBox;
  }

}