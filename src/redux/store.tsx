import { SET_FILTER, SetFilterAction } from './actions'
import { createStore, Store } from 'redux'
import { Filter, Stats } from '../model/models'
import { Config } from '../../cli/config'
import { Change, Data, UserMap } from '../../cli/backend/models'
import { extractUsers } from '../core/users'

export interface StoreState {
  filter?: Filter
  changes?: Change[]
  users?: UserMap
  config?: Config
}

/**
 * When dates are stringified they become strings. we need to convert them back to dates.
 */
const fixDates = (data: Data) => {
  data.changes.forEach(change => {
    change.updated = new Date(change.updated)
    change.created = new Date(change.created)
    change.reviews.forEach(review => {
      review.date = new Date(review.date)
      review.changeId = change.id
    })
    change.comments.forEach(comment => {
      comment.date = new Date(comment.date)
      comment.changeId = change.id
    })
  })
  return data
}

const root: any = window
const rootData = fixDates(root.data)
const DEFAULT_STATE: StoreState = {
  changes: rootData.changes,
  config: root.config,
  filter: {
    usernames: root.config.users,
  },
  users: extractUsers(rootData.changes),
}

export const reducer = (state: StoreState = DEFAULT_STATE, action: SetFilterAction): StoreState => {
  switch (action.type) {
    case SET_FILTER: {
      return {
        ...state,
        filter: action.filter,
      }
    }
    default:
      return state
  }
}

export const store: Store<StoreState> = createStore(reducer)
