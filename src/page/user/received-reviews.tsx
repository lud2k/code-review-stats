import * as React from 'react'
import { SortableTable, TableColumn } from '../common/sortable-table'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as moment from 'moment'
import * as styles from './received-reviews.css'
import { useChanges } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'
import { GerritLink } from '../common/gerrit-link'

const getData = (changes: Change[], username: string): any[] => {
  return changes
    .map(change => {
      if (change.owner.username === username) {
        return {
          subject: <GerritLink change={change} />,
          status: change.status,
          reviews: change.reviews.length,
          comments: change.comments.length,
          size: change.deletions + change.insertions,
          timeInReview: change.updated.getTime() - change.created.getTime(),
        }
      }
    })
    .filter(data => !!data)
}

const renderRow = (entry: any, column: TableColumn) => {
  if (column.key === 'timeInReview') {
    return entry.timeInReview !== undefined ? moment.duration(entry.timeInReview).humanize() : ''
  } else {
    return entry[column.key]
  }
}

export const ReceivedReviews: React.FunctionComponent<{ username: string }> = ({ username }) => {
  const changes = useChanges()
  const data = getData(changes, username)
  const columns = [
    { key: 'subject', label: 'Subject', numeric: false },
    { key: 'status', label: 'Status', numeric: true },
    { key: 'comments', label: 'Comments', numeric: true },
    { key: 'reviews', label: 'Reviews', numeric: true },
    { key: 'size', label: 'Size', numeric: true },
    { key: 'timeInReview', label: 'Review Time', numeric: true },
  ]
  return (
    <Grid item xs={12} sm={12}>
      <Paper>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Received reviews
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
