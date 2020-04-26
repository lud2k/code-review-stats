import * as React from 'react'
import { Change } from '../../../cli/backend/models'
import { Paper, Grid } from '@material-ui/core'
import * as styles from './biggest-commit.css'
import { UsernameLink } from '../common/username-link'
import { useChanges, useFilter } from '../../redux/seletors'
import { Filter } from '../../model/models'
import {GerritLink} from '../common/gerrit-link'

const computeBiggestCommit = (changes: Change[], filter: Filter): Change => {
  let biggestChange: Change = null
  changes.forEach(change => {
    if (
      filter.usernames.includes(change.owner.username) &&
      change.status === 'MERGED' &&
      (!biggestChange ||
        change.insertions + change.deletions > biggestChange.insertions + biggestChange.deletions)
    ) {
      biggestChange = change
    }
  })
  return biggestChange
}

export const BiggestCommit: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const change = computeBiggestCommit(changes, filter)
  return (
    <Grid item xs={12} sm={4}>
      <Paper className={styles.paper}>
        <div className={styles.content}>
          <p>
            The biggest change merged was submitted by{' '}
            <b>
              <UsernameLink username={change.owner.username} />
            </b>
            !
          </p>
          <p>
            <GerritLink change={change} />{' '}
            had {change.deletions} deletions and {change.insertions} insertions.
          </p>
        </div>
      </Paper>
    </Grid>
  )
}
