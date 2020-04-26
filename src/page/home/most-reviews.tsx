import * as React from 'react'
import { Change } from '../../../cli/backend/models'
import { Paper, Grid } from '@material-ui/core'
import * as styles from './most-reviews.css'
import { UsernameLink } from '../common/username-link'
import { useChanges, useFilter } from '../../redux/seletors'
import { Filter } from '../../model/models'
import {GerritLink} from '../common/gerrit-link'

const getMostReviewsChange = (changes: Change[], filter: Filter): Change => {
  let biggestChange: Change = null
  changes.forEach(change => {
    if (
      filter.usernames.includes(change.owner.username) &&
      (!biggestChange || change.comments.length > biggestChange.comments.length)
    ) {
      biggestChange = change
    }
  })
  return biggestChange
}

export const MostReviews: React.FunctionComponent = () => {
  const filter = useFilter()
  const changes = useChanges()
  const change = getMostReviewsChange(changes, filter)
  return (
    <Grid item xs={12} sm={4}>
      <Paper className={styles.paper}>
        <div className={styles.content}>
          <p>
            The change with the most comments was submitted by{' '}
            <b>
              <UsernameLink username={change.owner.username} />
            </b>
            !
          </p>
          <p>
            <GerritLink change={change} />{' '}
            received {change.comments.length}
            &nbsp;comments.
          </p>
        </div>
      </Paper>
    </Grid>
  )
}
