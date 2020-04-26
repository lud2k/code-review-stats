import * as React from 'react'
import { Filter } from '../../model/models'
import { SortableTable, TableColumn } from '../common/sortable-table'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as moment from 'moment'
import * as _ from 'lodash'
import * as styles from './commits.css'
import { UsernameLink } from '../common/username-link'
import { useChanges, useFilter } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'

const getData = (allChanges: Change[], filter: Filter): any[] => {
  const changesPerUser: { string?: Change[] } = {}
  for (const change of allChanges) {
    if (filter.usernames.includes(change.owner.username)) {
      if (!changesPerUser[change.owner.username]) {
        changesPerUser[change.owner.username] = []
      }
      changesPerUser[change.owner.username].push(change)
    }
  }

  return filter.usernames.map(username => {
    const changes: Change[] = changesPerUser[username]
    if (!changes) {
      return {
        name: <UsernameLink username={username} />,
        open: 0,
        merged: 0,
        draft: 0,
        abandonned: 0,
        comments: 0,
        totalSize: 0,
        avgSize: 0,
        avgTimeInReview: undefined,
      }
    }

    const timesInReview: number[] = changes.map(
      change => {
        if (change.status === 'MERGED') {
          return change.updated.getTime() - change.created.getTime()
        } else {
          return -1
        }
      }
    ).filter(time => time !== -1)
    const receivedComments = changes.reduce(
      (ret, change) =>
        ret +
        change.comments.filter(comment => comment.author.username !== change.owner.username).length,
      0
    )
    const avgTimeInReview = timesInReview.length > 0 ? _.mean(timesInReview) : undefined
    return {
      name: username,
      open: changes.filter(change => change.status === 'NEW').length,
      merged: changes.filter(change => change.status === 'MERGED').length,
      draft: changes.filter(change => change.status === 'DRAFT').length,
      abandonned: changes.filter(change => change.status === 'ABANDONED').length,
      comments: receivedComments,
      totalSize: changes.reduce((prev, change) => {
        if (change.status === 'MERGED') {
          return prev + change.insertions + change.deletions
        } else {
          return prev
        }
      }, 0),
      avgSize: changes.reduce(
        (prev, change) => {
          if (change.status === 'MERGED') {
            return Math.max(prev, change.insertions + change.deletions)
          } else {
            return prev
          }
        },
        0
      ),
      avgTimeInReview,
    }
  })
}

const renderRow = (entry: any, column: TableColumn) => {
  if (column.key === 'avgTimeInReview') {
    return entry.avgTimeInReview !== undefined
      ? moment.duration(entry.avgTimeInReview).humanize()
      : ''
  } else if (column.key === 'name') {
    return <UsernameLink username={entry.name} />
  } else {
    return entry[column.key]
  }
}

export const Commits: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const data = getData(changes, filter)
  const columns = [
    { key: 'name', label: 'Name', numeric: false },
    { key: 'open', label: 'Open', numeric: true },
    { key: 'merged', label: 'Merged', numeric: true },
    { key: 'draft', label: 'Draft', numeric: true },
    { key: 'abandonned', label: 'Abandoned', numeric: true },
    { key: 'comments', label: 'Comments Received', numeric: true },
    { key: 'avgSize', label: 'Merged Size (max)', numeric: true },
    { key: 'totalSize', label: 'Merged Size (total)', numeric: true },
    { key: 'avgTimeInReview', label: 'Review Time (avg)', numeric: true },
  ]
  return (
    <Grid item xs={12} sm={12}>
      <Paper>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Commits by user
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
