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
export type TraitLabelsType = { singular: string, plural: string };
export type TraitLabelsTypeKeys = keyof TraitLabelsType;

export const TraitViewTypes = {
  "name": "By Name",
  "rank": "By Rank",
  "pyramid": "Pyramid"
};
export type TraitViewTypesKeys = keyof typeof TraitViewTypes;

export const CharacterTypes = {
  "NPC": "Non-Player Character",
  "PC": "Player Character",
  "mob": "Mob",
  "ship": "Ship",
}

export type CharacterTypesKeys = keyof typeof CharacterTypes;

export interface AspectData {
  name: string,
  description: string,
  freeInvokes: number
}

export interface CharacterAspectData extends AspectData {
  aspectType: AspectTypesKeys,
}

export interface ConsequenceAspectData extends AspectData {
  state: ConsequenceStateTypeKeys,
}

export const ConsequenceStateType = {
  free: "Free",
  used: "Used",
  recovering: "Recovering",
}

export type ConsequenceStateTypeKeys = typeof ConsequenceStateType[keyof typeof ConsequenceStateType];

export const ActionTypes = {
  "Overcome": "Overcome",
  "CaA": "Create an Advantage",
  "Defend": "Defend",
  "Attack": "Attack"
}

export type ActionTypesKeys = keyof typeof ActionTypes;

export const ConsequenceTypes = {
  "mild": "Mild",
  "moderate": "Moderate",
  "severe": "Severe"
}
export type ConsequenceType = keyof typeof ConsequenceTypes;

export const ModificationTypes = {
  "roll": "Roll",
  "effect": "effect"
}

export type ModificationTypesKeys = keyof typeof ModificationTypes;

export const StuntMechanicTypes = {
  "dice-roll": "Dice roll",
  "add-consequence": "Add consequence slot"
}

export type StuntMechanicType = keyof typeof StuntMechanicTypes;

export type StuntMechanicDieRollData = {
  mechanicType: "dice-roll",
  parameters: {
    trait: string,
    modifier: number,
    actions?: Array<ActionTypesKeys>,
    modificationType?: ModificationTypesKeys
  }
}

export type StuntMechanicAddConsequenceData = {
  mechanicType: "add-consequence",
  parameters: {
    consequenceLevel: ConsequenceType,
    trackLabel: string
  }
}
export type StuntMechanicData = StuntMechanicDieRollData | StuntMechanicAddConsequenceData;

export interface StuntData {
  name?: string,
  description?: string,
  mechanics: StuntMechanicData[]
}

export interface BoxData {
  isUsed: boolean,
  soakValue: number
}

export interface TrackData {
  trackId: string,
  trackLabel: string,
  showSoakAmount?: boolean,
  boxes: BoxData[],
  aspect: ConsequenceAspectData
}

export interface TraitData {
  name: string,
  rank: number
}

export interface ImageData {
  uri: string,
  caption?: string,
}

export const DEFAULT_REFRESH = 3;

export interface CharacterData {
  schemaVersion: string,
  id: string,
  name: string,
  playerName: string,
  characterType?: CharacterTypesKeys,
  campaigns: Array<string>,
  description: string,
  refresh: number,
  fatePoints: number,
  aspects: Array<CharacterAspectData>,
  images?: ImageData[];
  traitType: TraitTypesKeys,
  traits: Array<TraitData>,
  stunts: Array<StuntData>,
  tracks: Array<TrackData>,
  notes: Array<string>,
  tags: Array<string>,
}