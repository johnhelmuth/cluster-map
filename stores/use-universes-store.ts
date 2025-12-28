// import {defineStore} from 'pinia';
// import {reactive, watch} from "vue";

import { UniversesManager } from "~/models/UniversesManager";

const universesManager = reactive(new UniversesManager());

export function useUniversesStore() {
    return universesManager;
}
