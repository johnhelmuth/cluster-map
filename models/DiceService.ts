import Chance from 'chance';

const chance = new Chance();

export type DiceExpressionType = string;

export type DieType = 'fudge' | number;

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

export interface DiceRollInterface {
  diceTotal: number;
  diceResults: number[] | undefined;
  parsedRoll: parsedRollInterface;
}

export interface parsedRollInterface {
  expression: DiceExpressionType;
  numDice: number;
  dieType: DieType;
  modifier: number;
  description: string;
}

export interface DiceLogEntryInterface {
  timestamp: number; // Unix epoch when dice were rolled.
  diceRoll: DiceRollInterface;
}

export class DiceService {

  lastResult?: DiceRollInterface;

  diceLog = [] as DiceLogEntryInterface[];


  rollDice(diceExpression: string): DiceRollInterface | undefined {
    // console.group('DiceService.rollDice()');
    const parsedRoll = this.parseDiceExpression(diceExpression);
    // console.log('parsedRoll', parsedRoll);
    if (parsedRoll) {
      const {numDice, dieType, modifier} = parsedRoll;
      let diceTotal = 0;
      let diceResults = [] as number[];
      for (let d = 0; d < numDice; d++) {
        const r = this.rollADieType(dieType);
        if (typeof r !== "undefined") {
          diceTotal += r;
          diceResults.push(r);
        }
      }
      diceTotal += modifier;
      const diceRoll = {diceTotal, diceResults, parsedRoll };
      // console.log('diceRoll: ', diceRoll);
      this.diceLog.unshift({timestamp: Date.now(), diceRoll});
      this.lastResult = diceRoll;
      // console.groupEnd();
      return diceRoll;
    }
    // console.groupEnd();
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
    // console.group('validDieType');
    // console.log('matches[2]: ', matches[2]);
    if (Array.isArray(matches) && matches.length > 2 && typeof matches[2] !== 'undefined') {
      if (dieTypeSymbolMap.has(matches[2])) {
        dieType = dieTypeSymbolMap.get(matches[2]) as DieType;
      } else {
        const numDieType = parseInt(matches[2]);
        if (! isNaN(numDieType) && numDieType > 0) {
          dieType = numDieType;
        }
      }
    }
    // console.log('dieType: ', dieType);
    // console.groupEnd();
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
    // console.group('DiceService.parseDiceExpression()');
    const parseRegex = /^(?:(?:\s*([0-9]*)d([0-9]+|f)){0,1}\s*([+-][0-9]+){0,1}){0,1}\s*(.*)$/i;
    const matches = expression.match(parseRegex);
    // console.log('matches: ', matches);
    if (matches) {
      const numDice = this.validNumDice(matches);
      const dieType = this.validDieType(matches);
      const modifier = this.validModifier(matches);
      let description = '';
      if (matches.length > 4 && typeof matches[4] !== 'undefined') {
        description = matches[4].trim();
      }
      // console.log('from matches: numDice, dieType, modifier, description: ', numDice, dieType, modifier, description)
      if (numDice !== false && dieType !== false && modifier !== false) {
        // console.groupEnd();
        return {
          expression,
          dieType,
          numDice,
          modifier,
          description
        }
      }
      // console.groupEnd();
    }
  }


  rollADieType(dieType: DieType) {
    if (typeof dieType === 'number') {
      return chance.integer({ min: 1, max: dieType})
    } else if (dieTypeMetadata.has(dieType)) {
      const dieMetadata = dieTypeMetadata.get(dieType)
      if (dieMetadata) {
        return chance.integer(dieMetadata.chanceOptions);
      }
    }
  }

  clearDiceLog() {
    this.diceLog = [] as DiceLogEntryInterface[];;
  }
}
