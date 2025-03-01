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
            console.log('ClusterModel.constructor() this: ', this);
        } else {
            this.id = '';
            this.name = 'Unknown cluster name';
        }
    }

    addSystem(system: SystemModelInterface): void {
        this.systemsMap.set(system.id, system);
    }

    connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface): void {
        if (!this.areConnected(systemA, systemB)) {
            const strait = new StraitModel(systemA, systemB);
            this.straits.push(strait);
            this.calculateStraitsCurveDirections();
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
     */
    calculateStraitsCurveDirectionsData() {
        for (const strait of this.straits) {
            strait.setDrawDirection('center', 'data');
        }
    }

    /**
     * Sets the direction each strait in the cluster should curve when drawn for the Circular map style.
     *
     *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
     *
     *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
     *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
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
                        direction = 'left'
                    } else {
                        direction = 'right'
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
     */
    calculateStraitsCurveDirectionsLinear() {
        const ssIndexMap = [] as
            Array<
                {
                    drawnToLeft: number,
                    drawnToRight: number,
                }
            >;
        const emptyDrawCounts = {
            drawnToLeft: 0, drawnToRight: 0,
        };
        for (let systemIdx = 0; systemIdx < this.numSystems; systemIdx++) {
            ssIndexMap.push({ ...emptyDrawCounts });
        }
        const mapStyle = 'linear' as MapViewStylesType;
        console.log('ClusterModel.calculateStraitsCurveDirectionsLinear() ssIndexMap: ', ssIndexMap);

        let lastDrawnToLeft = false;
        for (const [systemId, straits] of this.getStraitsInSystemOrder()) {
            const systemAIndex = this.getSystemIndex(systemId);
            let drawnToLeft = 0;
            let drawnToRight = 0;
            for (let currSysIdx = systemAIndex; currSysIdx < ssIndexMap.length; currSysIdx++) {
                drawnToLeft += ssIndexMap[currSysIdx].drawnToLeft;
                drawnToRight += ssIndexMap[currSysIdx].drawnToRight;
            }
            console.log('ClusterModel.calculateStraitsCurveDirectionsLinear() drawnToLeft: ', drawnToLeft);
            console.log('ClusterModel.calculateStraitsCurveDirectionsLinear() drawnToRight: ', drawnToRight);
            if (straits.length) {
                straits[0].setDrawDirection('center', mapStyle);
                if (straits.length > 1) {
                    if (drawnToLeft < drawnToRight) {
                        lastDrawnToLeft = true;
                    } else if (drawnToLeft > drawnToRight) {
                        lastDrawnToLeft = false;
                    } else {
                        lastDrawnToLeft = ! lastDrawnToLeft;
                    }
                    straits[1].setDrawDirection(lastDrawnToLeft ? 'left' : 'right', mapStyle);
                    if (straits.length > 2) {
                        straits[2].setDrawDirection(lastDrawnToLeft ? 'left' : 'right', mapStyle);
                    }
                }

                for (const strait of straits) {
                    console.log('ClusterModel.calculateStraitsCurveDirectionsLinear() lastDrawnToLeft: ', lastDrawnToLeft);
                    const systemBIndex = this.getSystemIndex(strait.systemB.id);
                    for (let currSysIdx = systemAIndex; currSysIdx <= systemBIndex; currSysIdx++) {
                        if (strait.getDrawDirection(mapStyle) === 'right') {
                            ssIndexMap[currSysIdx].drawnToRight ++;
                        } else if (strait.getDrawDirection(mapStyle) === 'left') {
                            ssIndexMap[currSysIdx].drawnToLeft ++;
                        }
                    }
                }
            }
        }
        console.log('ClusterModel.calculateStraitsCurveDirectionsLinear() this.getStraitsInSystemOrder(): ', this.getStraitsInSystemOrder());
    }

    maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType) : number {
        // TODO calculate the max radius outside the system and straits graph. Used to position external system info plate.
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
        console.log('ClusterModel.maxStraitRadius() maxStraitRadius: ', maxStraitRadius);
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
                        this.connectSystems(systemA, systemB);
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
