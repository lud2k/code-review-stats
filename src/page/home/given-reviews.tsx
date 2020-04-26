import * as React from 'react'
import { Filter } from '../../model/models'
import * as _ from 'lodash'
import { SortableTable, TableColumn } from '../common/sortable-table'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as styles from './given-reviews.css'
import { UsernameLink } from '../common/username-link'
import { useChanges, useFilter } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'
import { getCommentsByUser, getReviewsByUser } from '../../core/filter'

const getData = (changes: Change[], filter: Filter): any[] => {
  const reviewsByUser = getReviewsByUser(changes, filter)
  const commentsByUser = getCommentsByUser(changes, filter)

  return _.map(filter.usernames, username => {
    const reviews = reviewsByUser[username] || []
    const comments = commentsByUser[username] || []
    return {
      name: username,
      '-2': reviews.reduce((ret, { review }) => ret + (review.score === -2 ? 1 : 0), 0),
      '-1': reviews.reduce((ret, { review }) => ret + (review.score === -1 ? 1 : 0), 0),
      '+1': reviews.reduce((ret, { review }) => ret + (review.score === 1 ? 1 : 0), 0),
      '+2': reviews.reduce(
        (ret, { change, review }) => (review.score === 2 ? ret.add(change.id) : ret),
        new Set()
      ).size,
      comments: comments.length,
      commits: reviews.reduce((ret, { review }) => ret.add(review.changeId), new Set()).size,
    }
  })
}

const renderRow = (entry: any, column: TableColumn) => {
  if (column.key === 'name') {
    return <UsernameLink username={entry.name} />
  } else {
    return entry[column.key]
  }
}

export const GivenReviews: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const data = getData(changes, filter)
  const columns = [
    { key: 'name', label: 'Name', numeric: false },
    { key: '-2', label: '-2', numeric: true },
    { key: '-1', label: '-1', numeric: true },
    { key: '+1', label: '+1', numeric: true },
    { key: '+2', label: '+2', numeric: true },
    { key: 'comments', label: 'Comments', numeric: true },
    { key: 'commits', label: 'Commits', numeric: true },
  ]
  return (
    <Grid item xs={12} sm={12}>
      <Paper>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Given reviews
        </Typography>
        <SortableTable
          defaultOrderBy={[false, 'name']}
          data={data}
          columns={columns}
          rowsPerPage={15}
          rowRenderer={renderRow}
          className={styles.table}
        />
      </Paper>
    </Grid>
  )
}
