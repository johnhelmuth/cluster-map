export const AspectTypes = {
    HighConcept: "HighConcept",
    Trouble: "Trouble",
    Relationship: "Relationship",
    Other: "Other"
};

export type AspectTypesKeys = typeof AspectTypes[keyof typeof AspectTypes];

export const TraitTypes = {
    skill: "Skill",
    approach: "Approach",
    profession: "Profession",
    other: "Other"
} as const;

export type TraitTypesKeys = keyof typeof TraitTypes;

export interface AspectData {
    name: string,
    description: string,
    freeInvokes: number
}

export interface CharacterAspectData extends AspectData {
    aspectType: AspectTypesKeys,
}

export const ActionTypes = {
    "Overcome": "Overcome",
    "CaA": "Create an Advantage",
    "Defend": "Defend",
    "Attack": "Attack"
}

export type ActionTypesKeys = typeof ActionTypes[keyof typeof ActionTypes];

export const ModificationTypes = {
    "roll": "Roll",
    "effect": "effect"
}

export type ModificationTypesKeys = typeof ModificationTypes[keyof typeof ModificationTypes];

export interface StuntData {
    name: string,
    description: string,
    parameters: {
        trait: string,
        modifier: number,
        actions: Array<ActionTypesKeys>,
        modificationType: ModificationTypesKeys
    }
}

export const TrackTypes = {
    stress: "Stress",
    consequences: "Consequences"
}

export type TrackTypesKeys = typeof TrackTypes[keyof typeof TrackTypes];

export const StressSoakType = {
    "single": "Single",
    "increasing": "Increasing",
}

export type StressSoakTypeKeys = typeof StressSoakType[keyof typeof StressSoakType];

export interface StressParamsData {
    stressSoakType: StressSoakTypeKeys,
    stressBoxLimitPerAction: number,
    numBoxes: number,
    isUsed: Array<boolean>
}

export const SlotTypes = {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe"
}
export type SlotTypesKeys = typeof SlotTypes[keyof typeof SlotTypes];

export const ConsequenceStateType = {
    free: "Free",
    used: "Used",
    recovering: "Recovering",
}

export type ConsequenceStateTypeKeys = typeof ConsequenceStateType[keyof typeof ConsequenceStateType];

export interface ConsequenceParamsData {
    slotType: SlotTypesKeys,
    slotSoakAmount: number,
    aspect: AspectData,
    state: ConsequenceStateTypeKeys,
}

export interface TrackData {
    trackId: string,
    trackType: TrackTypesKeys,
    trackLabel: string,
    stressParams: StressParamsData,
    consequenceParams: ConsequenceParamsData
}

export interface TraitData {
    name: string,
    rank: number
}

export const DEFAULT_REFRESH = 3;

export interface CharacterData {
    schemaVersion: string,
    id: string,
    name: string,
    description: string,
    refresh: number,
    fatePoints: number,
    aspects: Array<CharacterAspectData>,
    traitType: TraitTypesKeys,
    traits: Array<TraitData>,
    stunts: Array<StuntData>,
    tracks: Array<TrackData>
}