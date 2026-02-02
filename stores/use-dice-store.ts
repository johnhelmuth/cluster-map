import {type DiceLogEntryInterface, DiceService} from "~/models/DiceService";
import {isDiceLog} from "~/utils/utils";

let diceService: DiceService;

export let localStorage = undefined as Storage | undefined;

let diceLogRaw = [] as DiceLogEntryInterface[];

const DICE_LOG_KEY = 'cluster-map:dice-log-key';

export function initLocalStorage() {
  if (import.meta.client) {
    localStorage = window.localStorage;
  }
}
export function useDiceStore() {

  initLocalStorage();

  function hasLocalStorage() {
    return !!localStorage;
  }

  function getLocalStorage() {
    if (localStorage) {
      return localStorage;
    }
    throw new Error('Local Storage is not available in this context.');
  }

  function updateLocalStorage(data: any) {
    if (isDiceLog(data)) {
      const ls = getLocalStorage();
      ls.setItem(DICE_LOG_KEY, JSON.stringify(data));
    }
  }

  if (!diceService) {
    if (hasLocalStorage()) {
      const diceLogJSONString = getLocalStorage().getItem(DICE_LOG_KEY);
      if (diceLogJSONString) {
        const diceLogJSON = JSON.parse(diceLogJSONString);
        if (diceLogJSON && isDiceLog(diceLogJSON)) {
          diceLogRaw = diceLogJSON;
        }
      }
    }
    diceService = reactive(new DiceService(diceLogRaw));
    updateLocalStorage(diceLogRaw);
    watch(diceService, () => {
      updateLocalStorage(diceService.diceLog);
    })
  }
  return diceService;
}
