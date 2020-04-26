import { useSelector } from 'react-redux'
import { StoreState } from './store'
import {Change, User} from '../../cli/backend/models'
import { Config } from '../../cli/config'
import { Filter } from '../model/models'

export const useUser = (username: string): User => {
  return useSelector((state: StoreState) => state.users[username])
}

export const useConfig = (): Config => {
  return useSelector((state: StoreState) => state.config)
}

export const useFilter = (): Filter => {
  return useSelector((state: StoreState) => state.filter)
}

export const useChanges = (): Change[] => {
  return useSelector((state: StoreState) => state.changes)
}
