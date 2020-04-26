import * as React from 'react'
import { Change } from '../../../cli/backend/models'
import {useConfig} from '../../redux/seletors'

export const GerritLink: React.FunctionComponent<{ change: Change }> = ({ change }) => {
  const config = useConfig()
  return (
    <a target="_blank" href={`${config.host}/c/${change.project}/+/${change.id}`}>
      {change.subject}
    </a>
  )
}
