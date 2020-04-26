import { Change, UserMap } from '../../cli/backend/models'

export const extractUsers = (changes: Change[]): UserMap => {
  const users: UserMap = {}
  changes.forEach(change => {
    users[change.owner.username] = change.owner
  })
  return users
}
