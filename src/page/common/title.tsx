import * as React from 'react'
import { Typography } from '@material-ui/core'
import { useConfig } from '../../redux/seletors'

export const Title: React.FunctionComponent<{ section?: string; subSection?: string }> = ({
  section,
  subSection,
}) => {
  const config = useConfig()
  const name = config.title || 'Code Review Stats'

  document.title = name

  const title = []
  if (section) {
    title.push(section)
  }
  if (subSection) {
    title.push(subSection)
  }
  if (!title.length) {
    title.push(name)
  }

  return (
    <Typography variant="h5" color="inherit" style={{ flex: 1 }}>
      {title.join(' » ')}
    </Typography>
  )
}
