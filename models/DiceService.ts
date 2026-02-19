import Chance from 'chance';
import {isDiceLog} from "~/utils/utils";

const chance = new Chance();

export const DICE_ROLLS_FOR_STATS = 1000000;

export type DiceExpressionType = string;

export type DieType = 'fudge' | number;
export type DieTypeNumDiceType = string; // "NumDice:DieType"

export type DieTypeMetadata = {
  symbol: string;
  chanceOptions: Partial<Chance.IntegerOptions>
}

export const dieTypeMetadata = new Map<DieType, DieTypeMetadata>([
      ['fudge', { symbol: 'f', chanceOptions: {min: -1, max: 1} }],
  ]
)
export const dieTypeSymbolMap = new Map<string, DieType>([
      ['f', 'fudge'],
  ]
)

const RNGTypesList = ['myRand', 'chance'];
export type RNGTypesType = 'myRand' | 'chance'
export const RNG_DEFAULT: RNGTypesType = 'chance';
export function isRNGTypesType(data: any): data is RNGTypesType {
  if (typeof data === 'string') {
    return RNGTypesList.includes(data)
  }
  return false;
}

export interface parsedRollInterface {
  expression: DiceExpressionType;
  numDice: number;
  dieType: DieType;
  modifier: number;
  description: string;
}

export interface DiceRollRawInterface {
  diceTotal: number;
  diceResults: number[];
  RNGUsed: RNGTypesType;
}

export interface DiceRollInterface extends DiceRollRawInterface {
  parsedRoll: parsedRollInterface;
}

export interface DiceLogEntryInterface {
  timestamp: number; // Unix epoch when dice were rolled.
  diceRoll: DiceRollInterface;
}

/**
 * Dice Stats types
 */
export interface ReportForDieTypeResult {
  result: number,
  count: number,
}

export interface ReportForDieTypeInterface {
  RNGUsed: RNGTypesType;
  dieType: DieType,
  numDice: number;
  count: number,
  total: number,
  reportForResult: ReportForDieTypeResult[]
}

export type ReportForDice = Map<DieTypeNumDiceType, ReportForDieTypeInterface>;

export class DiceService {

  _RNGDefault: RNGTypesType;

  lastResult?: DiceRollInterface;

  diceLog = [] as DiceLogEntryInterface[];

  constructor(diceLog: DiceLogEntryInterface[], rngUsed?: RNGTypesType) {
    this._RNGDefault = typeof rngUsed !== 'undefined' ? rngUsed : RNG_DEFAULT;
    this.loadDiceLog(diceLog);
  }

  get RNGDefault() {
    return this._RNGDefault;
  }

  loadDiceLog(diceLog: DiceLogEntryInterface[]) {
    if (diceLog && isDiceLog(diceLog)) {
      this.diceLog = diceLog;
      if (! this.lastResult && this.diceLog.length > 0) {
        const diceLogEntry = this.diceLog[this.diceLog.length-1] as DiceLogEntryInterface;
        this.lastResult = diceLogEntry.diceRoll;
      }
    }
  }

  rollDice(diceExpression: string): DiceRollInterface | undefined {
    const parsedRoll = this.parseDiceExpression(diceExpression);
    if (parsedRoll) {
      const diceRollRaw = this._rollDiceRaw(parsedRoll.dieType, parsedRoll.numDice);
      const diceRoll = { ...diceRollRaw, parsedRoll}
      diceRoll.diceTotal += parsedRoll.modifier;
      this.diceLog.push({timestamp: Date.now(), diceRoll});
      this.lastResult = diceRoll;
      return diceRoll;
    }
  }

  _rollDiceRaw(dieType: DieType, numDice: number, RNG?: RNGTypesType) : DiceRollRawInterface {
    const RNGUsed = RNG || this._RNGDefault;
    let diceTotal = 0;
    let diceResults = [] as number[];
    for (let d = 0; d < numDice; d++) {
      const r = this.rollADieType(dieType, RNGUsed);
      if (typeof r !== "undefined") {
        diceTotal += r;
        diceResults.push(r);
      }
    }
    return {diceTotal, diceResults, RNGUsed };
  }

  runDiceForStats(diceExpression: string, numRolls = DICE_ROLLS_FOR_STATS, RNG?: RNGTypesType) : ReportForDieTypeInterface {
    const RNGUsed = RNG || this._RNGDefault;
    const parsed = this.parseDiceExpression(diceExpression)
    if (! parsed) {
      throw new Error(`Dice expression "${diceExpression}" not parsable.`);
    }
    const { dieType, numDice } = parsed;

    let total = 0;
    let count = 0;
    const resultsMap = new Map<number, ReportForDieTypeResult>();

    for (let r=0; r < numRolls; r++) {
      const {diceTotal, diceResults} = this._rollDiceRaw(dieType, numDice, RNGUsed);
      total += diceTotal;
      count ++;
      if (resultsMap.has(diceTotal)) {
        const report = resultsMap.get(diceTotal);
        if (report) {
          report.count++;
        }
      } else {
        const report = {
          result: diceTotal,
          count: 1,
        }
        resultsMap.set(diceTotal, report);
      }
    }

    return {
      RNGUsed,
      dieType,
      numDice,
      total,
      count,
      reportForResult: [...resultsMap.values()].sort((a, b) => a.result - b.result)
    };
  }

  validNumDice(matches: RegExpMatchArray) {
    let numDice = false as false | number;
    if (Array.isArray(matches) && matches.length > 1 && typeof matches[1] !== 'undefined') {
      const parsedNumDice = parseInt(matches[1]);
      if (! isNaN(parsedNumDice) && parsedNumDice > 0) {
        numDice = parsedNumDice;
      } else {
        numDice = 1;
      }
    }
    return numDice;
  }

  validDieType(matches: RegExpMatchArray) {
    let dieType = false as false | DieType;
    if (Array.isArray(matches) && matches.length > 2 && typeof matches[2] !== 'undefined') {
      const dieSymbol = matches[2].toLowerCase()
      if (dieTypeSymbolMap.has(dieSymbol)) {
        dieType = dieTypeSymbolMap.get(dieSymbol) as DieType;
      } else {
        const numDieType = parseInt(matches[2]);
        if (! isNaN(numDieType) && numDieType > 0) {
          dieType = numDieType;
        }
      }
    }
    return dieType;
  }

  validModifier(matches: RegExpMatchArray) {
    let modifier = false as false | number;
    if (Array.isArray(matches) && matches.length > 3 && typeof matches[3] !== 'undefined') {
      const parsedModifier = parseInt(matches[3]);
      if (! isNaN(parsedModifier)) {
        modifier = parsedModifier;
      }
    } else {
      modifier = 0;
    }
    return modifier;
  }

  parseDiceExpression(expression: DiceExpressionType) {
    const parseRegex = /^(?:(?:\s*([0-9]*)d([0-9]+|f)){0,1}\s*([+-][0-9]+){0,1}){0,1}\s*(.*)$/i;
    const matches = expression.match(parseRegex);
    if (matches) {
      const numDice = this.validNumDice(matches);
      const dieType = this.validDieType(matches);
      const modifier = this.validModifier(matches);
      let description = '';
      if (matches.length > 4 && typeof matches[4] !== 'undefined') {
        description = matches[4].trim();
      }
      if (numDice !== false && dieType !== false && modifier !== false) {
        return {
          expression,
          dieType,
          numDice,
          modifier,
          description
        }
      }
    }
  }

  rollADieType(dieType: DieType, RNG?: RNGTypesType) {
    if (typeof dieType === 'number') {
      return this.randomInRange(1, dieType, RNG)
    } else if (dieTypeMetadata.has(dieType)) {
      const dieMetadata = dieTypeMetadata.get(dieType)
      if (dieMetadata) {
        const { min, max } = dieMetadata.chanceOptions;
        if (typeof min === 'number' && typeof max === 'number') {
          return this.randomInRange(min, max, RNG);
        }
      }
    }
  }

  clearDiceLog() {
    this.diceLog.splice(0, this.diceLog.length);
    this.lastResult = undefined;
  }

  randomInRange(min: number, max: number, RNG?: RNGTypesType) {
    const RNGToUse = RNG || this._RNGDefault;
    if (RNGToUse === 'chance') {
      return chance.integer({ min, max });
    } else {
      return myRand.randomInRange(min, max);
    }
  }
}

const UINT32_MAX = 0xFFFFFFFF;
const RAND_BUFFER_SIZE = 100;

class Random {
  randomBuffer: Uint32Array | undefined = undefined;
  next: number = 0;

  constructor() {
    this.next = RAND_BUFFER_SIZE; // Only call fillRandomBuffer() if getNext() is called.
  }

  fillRandomBuffer() {
    if (! this.randomBuffer) {
      this.randomBuffer = new Uint32Array(RAND_BUFFER_SIZE);
    }
    self.crypto.getRandomValues(this.randomBuffer);
    this.next = 0;
  }

  randomInRange(min: number, max: number) {
    const num = this.getNext();
    return Math.floor((num/UINT32_MAX)*(max - min + 1)+min);
  }

  isFilledBuffer(data: any): data is Uint32Array {
    return data instanceof Uint32Array;
  }

  getNext() {
    if (! this.randomBuffer || this.next >= this.randomBuffer.length) {
      this.fillRandomBuffer();
    }
    if (! this.isFilledBuffer(this.randomBuffer)) {
      throw new Error('Uninitialized random buffer.');
    }
    return this.randomBuffer[this.next++] as number;
  }
}

let myRand = new Random();