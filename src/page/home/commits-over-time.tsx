
import * as React from 'react'
import {DayStats, Stats} from '../../model/models'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis} from 'recharts'
import * as randomColor from 'randomcolor'
import * as moment from 'moment'
import {Config} from '../../../cli/config'

const styles = require('./commits-over-time.css')

export class CommitsOverTime extends React.Component<{ stats: Stats, config: Config }, {}> {
    getDates(): string[] {
        let current = moment()
        const ret = []
        for (let i=0; i<this.props.config.days; i++) {
            ret.push(current.format('YYYY-MM-DD'))
            current = current.subtract(1, 'day')
        }
        return ret.reverse()
    }

    getData(): DayStats[] {
        const {daily} = this.props.stats
        const dates = this.getDates()
        let last: DayStats = null
        const ret: DayStats[] = []
        dates.forEach((date) => {
            const stat = daily[date]
            if (stat) {
                ret.push(stat)
                last = stat
            } else {
                ret.push({
                    date,
                    reviews: [],
                    comments: [],
                    changes: last ? last.changes : new Set(),
                    opened: [],
                    closed: [],
                })
            }
        })
        return ret
    }

    render() {
        const colors = randomColor({
            luminosity: 'dark',
            count: 5,
            seed: 15158730,
        })
        return (
            <Grid item xs={12} sm={12}>
                <Paper className={styles.paper}>
                    <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                        Commits over time
                    </Typography>
                    <LineChart
                        width={1000}
                        height={400}
                        data={this.getData()}
                        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                    >
                        <Tooltip labelFormatter={(date) => moment(date).format('dddd, MMMM Do')} />
                        <XAxis dataKey='date' hide={true} />
                        <CartesianGrid stroke='#f5f5f5' />
                        <Line type='monotone' dataKey={(day: DayStats) => day.opened.length} stroke={colors[0]}
                              yAxisId={0} name='New' />
                        <Line type='monotone' dataKey={(day: DayStats) => day.closed.length} stroke={colors[1]}
                              yAxisId={0} name='Closed' />
                        <Line type='monotone' dataKey={(day: DayStats) => day.reviews.length} stroke={colors[2]}
                              yAxisId={0} name='Reviews' />
                        <Line type='monotone' dataKey={(day: DayStats) => day.comments.length} stroke={colors[3]}
                              yAxisId={0} name='Comments' />
                        <Line type='monotone' dataKey={(day: DayStats) => day.changes.size} stroke={colors[4]}
                              yAxisId={0} name='In Review' />
                        <Legend height={48} />
                    </LineChart>
                </Paper>
            </Grid>
        )
    }
}
