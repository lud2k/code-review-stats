
import * as React from 'react'
import {Stats} from '../../model/models'
import {SortableTable, TableColumn} from '../common/sortable-table'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import * as moment from 'moment'
import * as _ from 'lodash'
import {Config} from '../../../cli/config'

const styles = require('./commits.css')

export class Commits extends React.Component<{ stats: Stats, config: Config }, {}> {
    getData(): any[] {
        const {stats} = this.props
        return _.map(stats.users, (stat, username) => {
            const timesInReview: number[] = stat.changes.map((change) =>
                change.updated.getTime()-change.created.getTime())
            const avgTimeInReview = timesInReview.length > 0 ? _.mean(timesInReview) : undefined
            return {
                name: username,
                open: stat.changes.filter((change) => change.status === 'NEW').length,
                merged: stat.changes.filter((change) => change.status === 'MERGED').length,
                draft: stat.changes.filter((change) => change.status === 'DRAFT').length,
                abandonned: stat.changes.filter((change) => change.status === 'ABANDONED').length,
                comments: stat.receivedComments.length,
                totalSize: stat.changes.reduce((prev, change) => (prev+change.insertions+change.deletions), 0),
                avgSize: stat.changes.reduce((prev, change) => Math.max(prev, change.insertions+change.deletions), 0),
                avgTimeInReview,
            }
        })
    }

    renderRow = (entry: any, column: TableColumn) => {
        if (column.key === 'avgTimeInReview') {
            return entry.avgTimeInReview !== undefined ? moment.duration(entry.avgTimeInReview).humanize() : ''
        } else {
            return entry[column.key]
        }
    }

    render() {
        const data = this.getData()
        const columns = [
            { key: 'name', label: 'Name', numeric: false },
            { key: 'open', label: 'Open', numeric: true },
            { key: 'merged', label: 'Merged', numeric: true },
            { key: 'draft', label: 'Draft', numeric: true },
            { key: 'abandonned', label: 'Abandoned', numeric: true },
            { key: 'comments', label: 'Comments Received', numeric: true },
            { key: 'avgSize', label: 'Size (max)', numeric: true },
            { key: 'totalSize', label: 'Size (total)', numeric: true },
            { key: 'avgTimeInReview', label: 'Review Time (avg)', numeric: true },
        ]
        return (
            <Grid item xs={12} sm={12}>
                <Paper>
                    <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                        Commits by user
                    </Typography>
                    <SortableTable defaultOrderBy={[false, 'name']} data={data} columns={columns} rowsPerPage={15}
                                   rowRenderer={this.renderRow} className={styles.table} />
                </Paper>
            </Grid>
        )
    }
}
