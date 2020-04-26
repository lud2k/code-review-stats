import * as React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../redux/seletors'

export const UsernameLink: React.FunctionComponent<{ username: string }> = ({ username }) => {
  const user = useUser(username)
  return <Link to={`/users/${username}`}>{user?.name || username}</Link>
}
