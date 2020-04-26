import * as React from 'react'
import { SortableTable, TableColumn } from '../common/sortable-table'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as styles from './given-reviews.css'
import { useChanges } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'
import { GerritLink } from '../common/gerrit-link'

const getData = (changes: Change[], username: string): any[] => {
  return changes
    .map(change => {
      if (change.owner.username === username) {
        return null
      }

      const reviews = change.reviews.filter(review => review.author.username === username)
      const comments = change.comments.filter(comment => comment.author.username === username)
      if (!reviews.length && !comments.length) {
        return null
      }

      return {
        subject: <GerritLink change={change} />,
        '-2': reviews.reduce((ret, review) => ret + (review.score === -2 ? 1 : 0), 0),
        '-1': reviews.reduce((ret, review) => ret + (review.score === -1 ? 1 : 0), 0),
        '+1': reviews.reduce((ret, review) => ret + (review.score === 1 ? 1 : 0), 0),
        '+2': reviews.reduce((ret, review) => ret + (review.score === 2 ? 1 : 0), 0),
        comments: comments.length,
        commits: 0,
      }
    })
    .filter(data => !!data)
}

const renderRow = (entry: any, column: TableColumn) => {
  return entry[column.key]
}

export const GivenReviews: React.FunctionComponent<{ username: string }> = ({ username }) => {
  const changes = useChanges()
  const data = getData(changes, username)
  const columns = [
    { key: 'subject', label: 'Subject', numeric: false },
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
          defaultOrderBy={[false, 'subject']}
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
