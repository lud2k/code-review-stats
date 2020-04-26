import * as React from 'react'
import { Filter } from '../../model/models'
import { Typography, Paper, Grid } from '@material-ui/core'
import { SortableTable, TableColumn } from '../common/sortable-table'
import * as styles from './projects-activity.css'
import { useChanges, useFilter } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'
import {ProjectLink} from '../common/project-link'

const getData = (allChanges: Change[], filter: Filter) => {
  const changesPerProject: { string?: Change[] } = {}
  for (const change of allChanges) {
    if (filter.usernames.includes(change.owner.username)) {
      if (!changesPerProject[change.project]) {
        changesPerProject[change.project] = []
      }
      changesPerProject[change.project].push(change)
    }
  }

  const projectChanges = Object.entries(changesPerProject)
  return projectChanges
    .map(([project, changes]) => {
      return {
        name: project,
        commits: changes.length,
        total: changes.reduce((ret, change) => {
          return ret + change.insertions + change.deletions
        }, 0),
        users: changes.reduce((ret, change) => {
          return ret.add(change.owner.username)
        }, new Set()).size,
      }
    })
    .filter(item => item.users > 0)
}

const renderRow = (entry: any, column: TableColumn) => {
  if (column.key === 'name') {
    return <ProjectLink projectName={entry.name} />
  } else {
    return entry[column.key]
  }
}

export const ProjectsActivity: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const data = getData(changes, filter)
  const columns = [
    { key: 'name', label: 'Project', numeric: false },
    { key: 'commits', label: 'Commits', numeric: true },
    { key: 'users', label: 'Users', numeric: true },
    { key: 'total', label: 'Commit Total Size', numeric: true },
  ]
  return (
    <Grid item xs={12} sm={8}>
      <Paper className={styles.paper}>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Projects
        </Typography>
        <SortableTable
          defaultOrderBy={[false, 'name']}
          data={data}
          columns={columns}
          rowsPerPage={8}
          rowRenderer={renderRow}
          className={styles.table}
        />
      </Paper>
    </Grid>
  )
}
