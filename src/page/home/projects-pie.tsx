
import * as React from 'react'
import {Stats} from '../../model/models'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import * as _ from 'lodash'
import * as randomColor from 'randomcolor'
import {Config} from '../../../cli/config'

const styles = require('./projects-pie.css')

export class ProjectsPie extends React.Component<{ stats: Stats, config: Config }, {}> {
    getData(): any[] {
        const {stats} = this.props
        const projectsStats = _.values(stats.projects)
        const colors = randomColor({
            luminosity: 'dark',
            count: projectsStats.length,
            seed: 15158730,
        })
        let result = projectsStats.map((projectStat, index) => ({
            name: projectStat.name,
            value: projectStat.changes.length,
            color: colors[index],
        }))
        result = _.orderBy(result, ['value'], ['desc'])
        if (result.length > 10) {
            const others = result.slice(10)
            result = result.slice(0, 10)
            result.push({
                name: 'Other',
                value: others.reduce((prev, item) => (prev+item.value), 0),
                color: colors[11],
            })
        }
        return result
    }

    render() {
        const data = this.getData()
        return (
            <Grid item xs={12} sm={4}>
                <Paper className={styles.paper}>
                    <Typography type='title' color='inherit' style={{ padding: '20px' }}>
                        Commits per project
                    </Typography>
                    <div className={styles.content}>
                        <PieChart width={200} height={220} className={styles.pieChart}>
                            <Pie data={data} cx={100} cy={100} innerRadius={40} outerRadius={80} fill='#8884d8'
                                 paddingAngle={3} dataKey='value'>
                                {data.map((entry) => <Cell fill={entry.color}/>)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </Paper>
            </Grid>
        )
    }
}
