import type {PointType} from "@/types/GeometryTypes";
import {SCHEMA_VERSION} from "@/constants";
import type {MapViewStylesType} from "@/types/MapViewTypes";
import { circularGraphSystemsRadius } from '@/utils/cluster-generator';
import type {SystemIdType, SystemModel} from "~/models/SystemModel";
import {straitParse} from "~/utils/import-validator";

export type DrawDirectionType = 'clockwise' | 'center' | 'counterclockwise';

/**
 * Strait model types
 *
 * A Strait is a path that an FTL drive can follow between star systems.
 */

/** StraitModelDataType
 *
 * Defines the data describing a strait on the wire, in an import/export file, or in a database.
 *
 * A Strait is a path that an FTL drive can follow between star systems.
 *
 * systems is a 2 element array of system Ids
 * direction is a direction the strait should be curved if drawn from the positions in the system data, clockwise,
 *   center (i.e. no curve) or counterclockwise.
 */
export type StraitModelData = {
    systems: Array<SystemIdType>,
    direction?: DrawDirectionType,
};

export class StraitModel {

    systemA: SystemModel;
    systemB: SystemModel;

    _drawDirections: { [K in MapViewStylesType]: DrawDirectionType };

    constructor(systemA: SystemModel, systemB: SystemModel) {
        this.systemA = systemA;
        this.systemB = systemB;
        this._drawDirections = {
            'data': 'center',
            'circular': 'center',
            'linear': 'center',
        }
    }

    getOtherSystem(system: SystemModel): SystemModel | undefined {
        if (this.systemA === system) {
            return this.systemB;
        }
        if (this.systemB === system) {
            return this.systemA;
        }
    }

    get id(): string {
        return `${this.systemA.id || 'unknown'}:${this.systemB.id || 'unknown'}`;
    }

    includes(system: SystemModel): boolean {
        return (this.systemA === system || this.systemB === system);
    }

    getStraitIndex(): number {
        return this.systemA.cluster.straits.indexOf(this);
    }

    /**
     * Calculates how to curve strait lines on the map, and returns the details for drawing that line.
     *
     * There are only ever 0, 1, 2, or 3 "outgoing" straits from a system, based on the cluster generation system.
     * If there's a strait outgoing from the system, the method calculates the curve parameters for drawing it, in an
     * attempt to make the graph look better, easier to understand.
     *
     * Index 0 is the first outgoing strait.  Every system in the cluster except the last has one of these. It should be
     * drawn as a straight line from the center of this system to the center of the connected system.
     *
     * Index 1 is the second outgoing strait.
     *
     * Index 2 is the third outgoing strait.
     *
     * Algorithm:
     *   Determine which system this is in the cluster. Even numbered (0, 2, 4, etc) arc to the right, when facing the
     *   connected system from the system. Odd numbered systems (1, 3, 5, etc) arc to the left.
     *
     *   Index 0 always goes straight.
     *   Index 1 always arcs out to the chosen direction at a shallow angle, based on the length of the midpoint normal.
     *   Index 2 always arcs out to the chosen direction at a steeper angle.
     *
     * @param index {number} - The index of this strait in the set of straits going out from this system
     * @param mapStyle {MapViewStylesType} - The style of the map, data, circular, linear.
     * @param rotate {boolean} - True if the strait should be drawn rotated -90 degress around the graph center.
     * @param radius {number} - The radius of the circle used to draw a star system on the graph.
     *
     * @return {
     *        straitLength: number,
     *        straitNormalAngle: number,
     *        straitMidPoint: PointType,
     *        controlPoint: PointType
     *    }
     */
    straitParameters(index: number, mapStyle: MapViewStylesType, rotate: boolean, radius: number): {
        straitLength: number,
        straitNormalAngle: number,
        straitMidPoint: PointType,
        quadControlPoint: PointType,
        cubicControlPoint1: PointType,
        cubicControlPoint2: PointType,
        pathType: 'arc' | 'curved',
        curveRadius: number,
    } {

        const a = this.systemA.getPosition(mapStyle, rotate);
        const b = this.systemB.getPosition(mapStyle, rotate);

        const direction = this.getDrawDirection(mapStyle);
        const indexFactor = radius;
        const curveRadius =
            direction === 'center'
                ? 0
                : this.curveRadius(index, mapStyle, radius);
        const straitLength = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

        const straitAngle = Math.atan2(
            (a.y - b.y),
            (a.x - b.x)
        );
        const directionAdjust = (direction == 'clockwise' ? 1 : -1);
        // direction 1: counterclockwise, -1: clockwise
        const straitNormalAngle = straitAngle
            + directionAdjust * (Math.PI / 2); // -90 degrees, in radians

        const straitMidPoint = {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        };

        const quadControlPoint =
            direction === 'center'
                ? straitMidPoint
                : {
                    x: Math.cos(straitNormalAngle) * curveRadius + straitMidPoint.x,
                    y: Math.sin(straitNormalAngle) * curveRadius + straitMidPoint.y
                };

        const cubicAngle1 = straitNormalAngle + directionAdjust * (Math.PI * 0.10);
        const cubicAngle2 = straitNormalAngle + (-1) * directionAdjust * (Math.PI * 0.10);
        const cubicControlPoint1 =
            direction === 'center'
                ? straitMidPoint
                : {
                    x: Math.cos(cubicAngle1) * curveRadius + a.x,
                    y: Math.sin(cubicAngle1) * curveRadius + a.y
                };

        const cubicControlPoint2 =
            direction === 'center'
                ? straitMidPoint
                : {
                    x: Math.cos(cubicAngle2) * curveRadius + b.x,
                    y: Math.sin(cubicAngle2) * curveRadius + b.y
                };
        const pathType = (mapStyle === 'circular' && index === 0
                ? 'arc'
                : 'curved'
              );

        return {
            straitLength,
            straitNormalAngle,
            straitMidPoint,
            quadControlPoint,
            cubicControlPoint1,
            cubicControlPoint2,
            pathType,
            curveRadius,
        };
    }

    curveRadius(index: number, mapStyle: MapViewStylesType, radius: number) : number {

        const indexFactor = radius;
        let curveRadius;
        switch (mapStyle) {
            case 'data':
                curveRadius = radius;
                break;
            case 'circular':
                const systemsRadius = circularGraphSystemsRadius();
                if (index === 0) {
                    curveRadius = systemsRadius; // radius * 1.25;
                } else {
                    curveRadius = radius;
                }
                break;
            case 'linear':
                curveRadius = radius + index * indexFactor + (index - 1) * (indexFactor);
                break;
            default:
                curveRadius = radius;
        }
        return curveRadius;
    }

    setDrawDirection(direction: DrawDirectionType, mapStyle: MapViewStylesType): void {
        this._drawDirections[mapStyle] = direction;
    }

    getDrawDirection(mapStyle: MapViewStylesType): DrawDirectionType {
        return this._drawDirections[mapStyle];
    }

    toJSON(key: string): object {
        return {
            "type": "strait",
            schemaVersion: SCHEMA_VERSION,
            systems: [
                this.systemA.id,
                this.systemB.id
            ],
            direction: this.getDrawDirection('data'),
        };
    }

}
