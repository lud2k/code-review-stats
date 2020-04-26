import * as React from 'react'
import { AppBar, Toolbar, Grid } from '@material-ui/core'
import { Title } from '../common/title'
import { GivenReviews } from './given-reviews'
import { Commits } from './commits'
import { CommitsOverTime } from './commits-over-time'
import { CommitsGraph } from './commits-graph'
import { ProjectsPie } from './projects-pie'
import { ProjectsActivity } from './projects-activity'
import { BiggestCommit } from './biggest-commit'
import { MostReviews } from './most-reviews'
import { MostReviewsUser } from './most-reviews-user'
import { FilterButton } from './filter-button'
import * as styles from './home.css'

export const Content: React.FunctionComponent = () => {
  return (
    <Grid container spacing={4}>
      <BiggestCommit />
      <MostReviews />
      <MostReviewsUser />
      <br />
      <ProjectsPie />
      <ProjectsActivity />
      <br />
      <GivenReviews />
      <br />
      <Commits />
      <br />
      {
      <CommitsOverTime />
      /*<br />
      <CommitsGraph />
      */}
    </Grid>
  )
}

export const Home: React.FunctionComponent = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Title section="Overview" />
          <FilterButton />
        </Toolbar>
      </AppBar>
      <div className={styles.content}>
        <Content />
      </div>
    </div>
  )
}
