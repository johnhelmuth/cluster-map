import type {SystemIdType, SystemModelInterface} from '@/types/SystemTypes';
import type {DrawDirectionType, StraitModelDataType, StraitModelInterface} from '@/types/StraitTypes';
import type {ClusterModelInterface, ClusterIdType, ClusterModelDataType} from "@/types/ClusterTypes";
import SystemModel from "@/models/SystemModel";
import {StraitModel} from "@/models/StraitModel";
import type {BoundingBoxType, ClusterOrientationType, MapViewStylesType} from "@/types/BasicTypes";
import {SCHEMA_VERSION} from "@/constants";

// import {getBoundingBox} from "@/utils/utils";

export class ClusterModel implements ClusterModelInterface {

    id: ClusterIdType = '';
    name: string = '';
    systemsMap: Map<SystemIdType, SystemModelInterface>;
    straits: Array<StraitModelInterface>;

    constructor(data?: ClusterModelDataType) {
        this.id = '';
        this.name = '';
        this.systemsMap = new Map<SystemIdType, SystemModelInterface>();
        this.straits = [];
        if (data) {
            this.importData(data);
            if ("id" in data) {
                this.id = data.id || '';
            }
            this.name = data.name;
        } else {
            this.id = '';
            this.name = 'Unknown cluster name';
        }
    }

    addSystem(system: SystemModelInterface): void {
        this.systemsMap.set(system.id, system);
    }

    connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface): StraitModelInterface|undefined {
        if (!this.areConnected(systemA, systemB)) {
            const strait = new StraitModel(systemA, systemB);
            this.straits.push(strait);
            this.calculateStraitsCurveDirections();
            return strait;
        }
    }

    areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface): boolean {
        const matches = this.straits.filter((strait) => {
            return (systemA.id == strait.systemA.id || systemA.id === strait.systemB.id)
                && (systemB.id == strait.systemA.id || systemB.id === strait.systemB.id)
        });
        return !!matches?.length;
    }

    getSystemByName(systemName: string): SystemModelInterface | null {
        const matches = [...this.systemsMap.entries()]
            .filter(
                ([_, system]) => system.name === systemName
            );
        if (matches.length) {
            return matches[0][1];
        }
        return null;
    }

    getSystemById(systemId: SystemIdType): SystemModelInterface | null | undefined {
        return this.systemsMap.get(systemId);
    }

    getSystemIndex(systemId: SystemIdType): number {
        return this.systems.findIndex((system: SystemModelInterface) => system.id === systemId);
    }

    getStraitsBySystem(system: SystemModelInterface): Array<StraitModelInterface> {
        const straits = this.straits.filter((strait) => strait.systemA.id === system.id || strait.systemB.id === system.id);
        if (straits?.length) {
            return straits;
        }
        return [];
    }

    /**
     * Sets the direction each strait in the cluster should curve when drawn for each of the map styles.
     */
    calculateStraitsCurveDirections() {
        this.calculateStraitsCurveDirectionsLinear();
        this.calculateStraitsCurveDirectionsCircular();
        this.calculateStraitsCurveDirectionsData();
    }

    /**
     * Sets the direction each strait in the cluster should curve when drawn for the Data map style.
     *
     *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
     *
     *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
     *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
     *
     *   Use strait lines ('center') unless it is recorded in the data for the cluster.
     */
    calculateStraitsCurveDirectionsData() {
        for (const strait of this.straits) {
            let direction = strait.getDrawDirection('data') || 'center';
            strait.setDrawDirection(direction, 'data');
        }
    }

    /**
     * Sets the direction each strait in the cluster should curve when drawn for the Circular map style.
     *
     *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
     *
     *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
     *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
     *
     *   The curve between system A to system B in the left half of the circle from system A, should
     *   curve to the left, that is clockwise.  If system B is in the right half of the circle from system A,
     *   the line should curve to the right, which is counterclockwise.
     */
    calculateStraitsCurveDirectionsCircular() {
        for (const [systemId, straits] of this.getStraitsInSystemOrder()) {
            if (straits.length) {
                let straitIndex = 0;
                const numSystems = this.numSystems;
                const midSystemIndex = numSystems / 2;
                for (const strait of straits) {
                    let direction: DrawDirectionType;
                    const origSystemIndex = this.getSystemIndex(strait.systemA.id);
                    const destSystemRelIndex = this.getSystemIndex(strait.systemB.id) - origSystemIndex;
                    if (destSystemRelIndex <= midSystemIndex && straitIndex !== 0) {
                        direction = 'clockwise'
                    } else {
                        direction = 'counterclockwise'
                    }
                    strait.setDrawDirection(direction, 'circular');
                    straitIndex++;
                }
            }
        }
    }

    /**
     * Sets the direction each strait in the cluster should curve when drawn for the linear map style.
     *
     *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
     *
     *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
     *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
     *
     *   Pick which direction a line between 2 systems should curve based on how many lines already exit
     *   on that side of the line from previous system's connections.  Clockwise lines will be to the left
     *   of a straight line, and counterclockwise will be to the right, assuming you are facing from the earlier
     *   systems to the later systems. The first connection between a system and the next system is always in the
     *   middle (or center.)
     */
    calculateStraitsCurveDirectionsLinear() {
        type DirectionCounts = {
            drawnClockwise: number,
            drawnCounterclockwise: number,
        };
        const ssIndexMap = [] as Array<DirectionCounts>;
        const emptyDrawCounts: DirectionCounts = {
            drawnClockwise: 0, drawnCounterclockwise: 0,
        };
        for (let systemIdx = 0; systemIdx < this.numSystems; systemIdx++) {
            ssIndexMap.push({...emptyDrawCounts});
        }
        const mapStyle = 'linear' as MapViewStylesType;

        let lastDrawClockwise = false;
        for (const [systemId, straits] of this.getStraitsInSystemOrder()) {
            const systemAIndex = this.getSystemIndex(systemId);
            let drawnToLeft = 0;
            let drawnToRight = 0;
            for (let currSysIdx = systemAIndex; currSysIdx < ssIndexMap.length; currSysIdx++) {
                drawnToLeft += ssIndexMap[currSysIdx].drawnClockwise;
                drawnToRight += ssIndexMap[currSysIdx].drawnCounterclockwise;
            }
            if (straits.length) {
                straits[0].setDrawDirection('center', mapStyle);
                if (straits.length > 1) {
                    if (drawnToLeft < drawnToRight) {
                        lastDrawClockwise = true;
                    } else if (drawnToLeft > drawnToRight) {
                        lastDrawClockwise = false;
                    } else {
                        lastDrawClockwise = !lastDrawClockwise;
                    }
                    straits[1].setDrawDirection(lastDrawClockwise ? 'clockwise' : 'counterclockwise', mapStyle);
                    if (straits.length > 2) {
                        straits[2].setDrawDirection(lastDrawClockwise ? 'clockwise' : 'counterclockwise', mapStyle);
                    }
                }

                for (const strait of straits) {
                    const systemBIndex = this.getSystemIndex(strait.systemB.id);
                    for (let currSysIdx = systemAIndex; currSysIdx <= systemBIndex; currSysIdx++) {
                        const direction = strait.getDrawDirection(mapStyle);
                        if (direction === 'counterclockwise') {
                            ssIndexMap[currSysIdx].drawnCounterclockwise++;
                        } else if (direction === 'clockwise') {
                            ssIndexMap[currSysIdx].drawnClockwise++;
                        }
                    }
                }
            }
        }
    }

    maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType): number {
        let maxStraitRadius = 0;
        for (const [, straits] of this.getStraitsInSystemOrder()) {
            let straitIndex = 0;
            for (const strait of straits) {
                if (strait.getDrawDirection(mapStyle) === direction) {
                    const straitRadius = strait.curveRadius(straitIndex, mapStyle, radius);
                    if (straitRadius > maxStraitRadius) {
                        maxStraitRadius = straitRadius;
                    }
                }
                straitIndex++;
            }
        }
        return maxStraitRadius;
    }

    /**
     * @see ClusterModelInterface
     */
    getStraitsInSystemOrder(): Map<SystemIdType, Array<StraitModelInterface>> {
        const systemStraitMap = new Map<SystemIdType, Array<StraitModelInterface>>();
        const straitsCapturedList: Array<StraitModelInterface> = [];
        for (const [systemId, system] of this.systemsMap) {
            const straitsBySystem = this.getStraitsBySystem(system)
                .filter((strait) => (!straitsCapturedList.includes(strait)));
            systemStraitMap.set(systemId, straitsBySystem);
            straitsCapturedList.push(...straitsBySystem);
        }
        return systemStraitMap;
    }

    getSystemsMap(): Map<SystemIdType, SystemModelInterface> {
        return this.systemsMap;
    }

    get systems(): Array<SystemModelInterface> {
        return [...this.systemsMap.entries()].map(([key, system]) => system);
    }

    get numSystems() {
        return this.systemsMap.size;
    }

    get boundingBox(): BoundingBoxType {
        return getBoundingBox(this.systems);
    }

    /**
     * The Aspect Ratio is the ratio of the width to the height, calculated like width / height.
     *
     */
    get aspectRatio(): number {
        const {upperLeft: ul, lowerRight: lr} = this.boundingBox;
        const width = Math.abs(lr.x - ul.x);
        const height = Math.abs(lr.y - ul.y);
        if (height === 0.0) {
            return NaN;
        }
        return width / height;
    }

    get orientation(): ClusterOrientationType {
        if (isNaN(this.aspectRatio)) {
            return 'square'; // Who knows?
        }
        if (this.aspectRatio >= 0.9 && 1.1 >= this.aspectRatio) {
            return 'square';
        } else if (this.aspectRatio < 0.9) {
            return 'portrait';
        }
        return 'landscape';
    }

    importData(data: ClusterModelDataType) {
        this.importSystems(data);
        this.importStraits(data)
    }

    importSystems(data: ClusterModelDataType) {
        if ("systems" in data) {
            for (const systemData of (data?.systems || [])) {
                const system = new SystemModel(this, systemData);
            }
        }
    }

    importStraits(data: ClusterModelDataType) {
        if ("straits" in data && data.straits instanceof Array) {
            for (const straitData of data.straits as Array<StraitModelDataType>) {
                const systemA = this.getSystemById(straitData.systems[0] as SystemIdType);
                if (systemA) {
                    const systemB = this.getSystemById(straitData.systems[1] as SystemIdType);
                    if (systemB) {
                        const strait = this.connectSystems(systemA, systemB);
                        if (strait && straitData?.direction) {
                            strait.setDrawDirection(straitData.direction, 'data');
                        }
                    }
                }
            }
            this.calculateStraitsCurveDirections();
        }
    }

    toJSON(key: string): object {
        return {
            type: "cluster",
            schemaVersion: SCHEMA_VERSION,
            id: this.id,
            name: this.name,
            systems: this.systems,
            straits: this.straits,
        }
    }
}
