import {DiceService} from "~/models/DiceService";

let diceService: DiceService;

export function useDiceStore() {
  if (!diceService) {
    diceService = reactive(new DiceService());
  }
  return diceService;
}
