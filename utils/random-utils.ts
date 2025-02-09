import type {attributeValueType} from "~/types/BasicTypes";


export function getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function rollDice(): attributeValueType {
    let total = 0;
    for (let i = 0; i < 4; i++) {
        const diceRoll = getRandomIntInclusive(-1, 1);
        total += diceRoll;
    }
    return total as attributeValueType;
}






function testRollDice() {

    const histogram = new Map<number, number>([
        [-4, 0],
        [-3, 0],
        [-2, 0],
        [-1, 0],
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
    ]);
    let grandTotal = 0;
    for (let i = 0; i < 1000000; i++) {
        const roll = rollDice();
        const resultCount = histogram.get(roll) as number + 1;
        histogram.set(roll, resultCount);
        grandTotal += roll;
    }
    let otherGrandTotal = 0;
    for (const [roll, count] of histogram.entries()) {
        otherGrandTotal += (roll * count);
    }
}
