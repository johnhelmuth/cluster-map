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