
import * as React from 'react'
import {Stats} from '../../model/models'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import * as _ from 'lodash'
import {SortableTable, TableColumn} from '../common/sortable-table'
import {Config} from '../../../cli/config'

const styles = require('./projects-activity.css')

export class ProjectsActivity extends React.Component<{ stats: Stats, config: Config }, {}> {
    getData(): any[] {
        const {stats} = this.props
        return _.map(stats.projects, (project) => {
            return {
                name: project.name,
                commits: project.changes.length,
                total: project.changes.reduce((ret, change) => (ret+change.insertions+change.deletions), 0),
                users: project.changes.reduce((ret, change) => (ret.add(change.owner.username)), new Set()).size,
            }
        })
    }

    renderRow = (entry: any, column: TableColumn) => {
        return entry[column.key]
    }

    render() {
        const data = this.getData()
        const columns = [
            { key: 'name', label: 'Project', numeric: false },
            { key: 'commits', label: 'Commits', numeric: true },
            { key: 'users', label: 'Users', numeric: true },
            { key: 'total', label: 'Commit Total Size', numeric: true },
        ]
        return (
            <Grid item xs={12} sm={8}>
                <Paper className={styles.paper}>
                    <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                        Projects
                    </Typography>
                    <SortableTable defaultOrderBy={[false, 'name']} data={data} columns={columns} rowsPerPage={8}
                                   rowRenderer={this.renderRow} className={styles.table} />
                </Paper>
            </Grid>
        )
    }
}
