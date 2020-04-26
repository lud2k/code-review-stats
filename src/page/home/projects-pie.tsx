import * as React from 'react'
import { Filter, Stats } from '../../model/models'
import { Typography, Paper, Grid } from '@material-ui/core'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import * as _ from 'lodash'
import * as randomColor from 'randomcolor'
import * as styles from './projects-pie.css'
import { Change } from '../../../cli/backend/models'
import {useChanges, useFilter} from '../../redux/seletors'

const getData = (changes: Change[], filter: Filter): any[] => {
  const changesPerProject: {string?: Change[]} = {}
  for (const change of changes) {
    if (filter.usernames.includes(change.owner.username)) {
      if (!changesPerProject[change.project]) {
        changesPerProject[change.project] = []
      }
      changesPerProject[change.project].push(change)
    }
  }
  const projectChanges = Object.entries(changesPerProject)

  const colors = randomColor({
    luminosity: 'dark',
    count: projectChanges.length,
    seed: 15158730,
  })
  let result = projectChanges.map(([project, changesInProject], index) => ({
    name: project,
    value: changesInProject.length,
    color: colors[index],
  }))
  result = _.orderBy(result, ['value'], ['desc'])
  if (result.length > 10) {
    const others = result.slice(10)
    result = result.slice(0, 10)
    result.push({
      name: 'Other',
      value: others.reduce((prev, item) => prev + item.value, 0),
      color: colors[11],
    })
  }
  return result
}

export const ProjectsPie: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const data = getData(changes, filter)
  return (
    <Grid item xs={12} sm={4}>
      <Paper className={styles.paper}>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Commits per project
        </Typography>
        <div>
          <PieChart width={200} height={220} className={styles.pieChart}>
            <Pie
              data={data}
              cx={100}
              cy={100}
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map(entry => (
                <Cell fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </Paper>
    </Grid>
  )
}
