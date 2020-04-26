import * as React from 'react'
import { SortableTable, TableColumn } from '../common/sortable-table'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as styles from './project-reviews.css'
import {useChanges, useFilter} from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'
import { Filter } from '../../model/models'
import { GerritLink } from '../common/gerrit-link'
import * as moment from 'moment'
import {UsernameLink} from '../common/username-link'

const getData = (changes: Change[], filter: Filter, projectName: string): any[] => {
  return changes
    .map(change => {
      if (change.project === projectName && filter.usernames.includes(change.owner.username)) {
        return {
          subject: <GerritLink change={change} />,
          owner: change.owner.username,
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
  } else if (column.key === 'owner') {
    return <UsernameLink username={entry.owner} />
  } else {
    return entry[column.key]
  }
}

export const ProjectReviews: React.FunctionComponent<{ projectName: string }> = ({
  projectName,
}) => {
  const changes = useChanges()
  const filter = useFilter()
  const data = getData(changes, filter, projectName)
  const columns = [
    { key: 'subject', label: 'Subject', numeric: false },
    { key: 'owner', label: 'Owner', numeric: false },
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
          Commits
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
