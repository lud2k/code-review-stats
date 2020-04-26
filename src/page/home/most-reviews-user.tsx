import * as React from 'react'
import { Change, Comment } from '../../../cli/backend/models'
import { Paper, Grid } from '@material-ui/core'
import * as styles from './most-reviews-user.css'
import { UsernameLink } from '../common/username-link'
import { Filter } from '../../model/models'
import { useChanges, useFilter } from '../../redux/seletors'
import {GerritLink} from '../common/gerrit-link'

const getMostReviewsUser = (changes: Change[], filter: Filter) => {
  const reviewsByUser: { string?: Set<string> } = {}
  changes.forEach(change => {
    change.reviews.forEach(comment => {
      if (filter.usernames.includes(comment.author.username) &&
        comment.author.username !== change.owner.username) {
        if (!reviewsByUser[comment.author.username]) {
          reviewsByUser[comment.author.username] = new Set()
        }
        reviewsByUser[comment.author.username].add(comment.changeId)
      }
    })
  })
  const reviews = [...Object.entries(reviewsByUser)].sort(([_username, changeIds]) => changeIds.size)[0]
  const changeId = reviews[1].values().next().value
  return {
    username: reviews[0],
    reviewedChanges: reviews[1],
    lastReviewedChange: changes.find(change => change.id === changeId),
  }
}

export const MostReviewsUser: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const { username, reviewedChanges, lastReviewedChange } = getMostReviewsUser(changes, filter)
  return (
    <Grid item xs={12} sm={4}>
      <Paper className={styles.paper}>
        <div className={styles.content}>
          <p>
            <b>
              <UsernameLink username={username} />
            </b>{' '}
            reviewed the most commits! {reviewedChanges.size} commits.
          </p>
          <p>
            One of those commits was <GerritLink change={lastReviewedChange} />.
          </p>
        </div>
      </Paper>
    </Grid>
  )
}
