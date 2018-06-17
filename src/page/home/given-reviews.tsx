
import * as React from 'react'
import {Stats} from '../../model/models'
import * as _ from 'lodash'
import {SortableTable, TableColumn} from '../common/sortable-table'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import {Config} from '../../../cli/config'

const styles = require('./given-reviews.css')

export class GivenReviews extends React.Component<{ stats: Stats, config: Config }, {}> {
    getData(): any[] {
        const {stats} = this.props
        return _.map(stats.users, (stat, username) => {
            return {
                'name': username,
                '-2': stat.givenMinus2.length,
                '-1': stat.givenMinus1.length,
                '+1': stat.givenPlus1.length,
                '+2': stat.givenPlus2.length,
                'comments': stat.givenComments.length,
                'commits': stat.reviewedChanges.length,
            }
        })
    }

    renderRow = (entry: any, column: TableColumn) => {
        return entry[column.key]
    }

    render() {
        const data = this.getData()
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
                    <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                        Given reviews
                    </Typography>
                    <SortableTable defaultOrderBy={[false, 'name']} data={data} columns={columns} rowsPerPage={15}
                                   rowRenderer={this.renderRow} className={styles.table} />
                </Paper>
            </Grid>
        )
    }
}
