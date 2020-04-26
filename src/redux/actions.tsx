import { Action } from 'redux'
import { Filter } from '../model/models'

export const SET_FILTER = 'SET_FILTER'

export interface SetFilterAction extends Action {
  filter: Filter
}

export const setFilter = (filter: Filter): SetFilterAction => ({
  type: SET_FILTER,
  filter,
})
