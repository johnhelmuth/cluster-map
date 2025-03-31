import type {TraitData, TraitViewTypesKeys} from "~/types/character/CharacterTypes";


function traitCompareFunction(viewType: TraitViewTypesKeys) {
  return function (a: TraitData, b: TraitData): number {
    let a_val, b_val;
    switch (viewType) {
      case 'rank':
      case 'pyramid':
        // Swap to get descending order.
        a_val = b.rank; b_val = a.rank;
        break;
      case 'name':
      default:
        a_val = a.name; b_val = b.name;
        break;
    }
    if (a_val < b_val) {
      return -1;
    } else if (a_val > b_val) {
      return 1;
    }
    return 0;
  }
}

function sortTraits(traits: Array<TraitData>, viewType: TraitViewTypesKeys) {
  return traits.sort(traitCompareFunction(viewType));
}

function getTraitsAsPyramid(traits: Array<TraitData>) {
  if (traits.length < 1) {
    return;
  }
  const pyramidTraitsMap = new Map<number, Array<TraitData>>();
  traits.forEach(trait => {
    let rankArray = [] as Array<TraitData>;
    if (pyramidTraitsMap.has(trait.rank)) {
      rankArray = pyramidTraitsMap.get(trait.rank) || [];
    }
    rankArray.push(trait);
    pyramidTraitsMap.set(trait.rank, rankArray);
  });
  return [...pyramidTraitsMap.entries()]
    .sort(([rankA,], [rankB,]) => {
      return rankB - rankA;
    }).map(([_, traitsArray]) => {
      return traitsArray.sort((a, b) => a.name.localeCompare(b.name));
    });
}

export function useTraitsOrdering() {
  return {
    sortTraits, getTraitsAsPyramid
  }

}