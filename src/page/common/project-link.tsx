import * as React from 'react'
import { Link } from 'react-router-dom'

export const ProjectLink: React.FunctionComponent<{ projectName: string }> = ({ projectName }) => {
  return <Link to={`/projects/${projectName}`}>{projectName}</Link>
}
