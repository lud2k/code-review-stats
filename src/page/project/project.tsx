import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { AppBar, Toolbar, Grid, IconButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Title } from '../common/title'
import * as styles from './project.css'
import {ProjectReviews} from './project-reviews'

export const Project: React.FunctionComponent<{ projectName: string }> = ({ projectName }) => {
  const history = useHistory()

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => history.push('/')}
          >
            <ArrowBack />
          </IconButton>
          <Title section="Project" subSection={projectName} />
        </Toolbar>
      </AppBar>
      <Grid className={styles.content}>
        <ProjectReviews projectName={projectName} />
      </Grid>
    </div>
  )
}
