import {
    SET_CONFIG, SET_DATA, SET_FILTER, SetConfigAction, SetDataAction, SetFilterAction,
} from './actions'
import {createStore, Store} from 'redux'
import {Filter, Stats} from '../model/models'
import {computeStats} from '../core/stats'
import {filterChanges} from '../core/filter'
import {Config} from '../../cli/config'
import {Change, Data} from '../../cli/backend/models'

export interface StoreState {
    filter?: Filter
    data?: Data
    changes?: Change[]
    filteredChanges?: Change[]
    stats?: Stats
    config?: Config
}

export const reducer = (state: StoreState = {}, action: SetConfigAction & SetDataAction & SetFilterAction):
    StoreState => {

    switch (action.type) {
        case SET_CONFIG: {
            return {
                ...state,
                config: action.config,
            }
        }
        case SET_FILTER: {
            const filteredChanges = state.changes ? filterChanges(action.filter, state.changes) : undefined
            return {
                ...state,
                filteredChanges,
                filter: action.filter,
                stats: filteredChanges ? computeStats(filteredChanges) : undefined,
            }
        }
        case SET_DATA: {
            const changes = action.data.changes
            const filteredChanges = filterChanges(state.filter, changes)
            return {
                ...state,
                changes,
                filteredChanges,
                data: action.data,
                stats: computeStats(filteredChanges),
            }
        }
        default:
            return state
    }
}

export const store: Store<StoreState> = createStore(reducer)
