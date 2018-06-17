import {Action} from 'redux'
import {Filter} from '../model/models'
import {Config} from '../../cli/config'
import {Data} from '../../cli/backend/models'

export const SET_DATA = 'SET_DATA'
export const SET_CONFIG = 'SET_CONFIG'
export const SET_FILTER = 'SET_FILTER'

export interface SetDataAction extends Action {
    data: Data
}

export interface SetConfigAction extends Action {
    config: Config
}

export interface SetFilterAction extends Action {
    filter: Filter
}

export const setData = (data: Data): SetDataAction => ({
    type: SET_DATA,
    data,
})

export const setConfig = (config: Config): SetConfigAction => ({
    type: SET_CONFIG,
    config,
})

export const setFilter = (filter: Filter): SetFilterAction => ({
    type: SET_FILTER,
    filter,
})
