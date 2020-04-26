import * as React from 'react'
import { DayStats, Filter, Stats } from '../../model/models'
import { Typography, Paper, Grid } from '@material-ui/core'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis } from 'recharts'
import * as randomColor from 'randomcolor'
import * as moment from 'moment'
import { Config } from '../../../cli/config'
import * as styles from './commits-over-time.css'
import { useChanges, useConfig, useFilter } from '../../redux/seletors'
import { Change } from '../../../cli/backend/models'

const getDates = (config: Config): string[] => {
  let current = moment()
  const ret = []
  for (let i = 0; i < config.days; i++) {
    ret.push(current.format('YYYY-MM-DD'))
    current = current.subtract(1, 'day')
  }
  return ret.reverse()
}

const getChanges = (changes: Change[], filter: Filter, config: Config): Change[] => {
  const minDate = new Date(Date.now() - config.days * 24 * 60 * 60 * 1000)
  return changes.filter(
    change =>
      ((change.status === 'MERGED' && change.updated > minDate) ||
        (change.status === 'NEW' && change.created > minDate)) &&
      filter.usernames.includes(change.owner.username)
  )
}

const getData = (changes: Change[], filter: Filter, config: Config): DayStats[] => {
  const dates = getDates(config)
  const relevantChanges = getChanges(changes, filter, config)

  const ret = dates.reduce((retDates, date) => {
    retDates[date] = { opened: [], closed: [], active: [] }
    return retDates
  }, {})

  relevantChanges.forEach(change => {
    dates.forEach(date => {
      if (change.status === 'NEW' && moment(date).isAfter(change.created)) {
        ret[date].active.push(change)
      }
      if (
        change.status === 'MERGED' &&
        moment(date).isBefore(change.updated) &&
        moment(date).isAfter(change.created)
      ) {
        ret[date].active.push(change)
      }
      if (date === moment(change.created).format('YYYY-MM-DD')) {
        ret[date].opened.push(change)
      }
      if (change.status === 'MERGED' && date === moment(change.updated).format('YYYY-MM-DD')) {
        ret[date].closed.push(change)
      }
    })
  })

  return dates.map(date => ({ date, ...ret[date] }))
}

export const CommitsOverTime: React.FunctionComponent = () => {
  const changes = useChanges()
  const filter = useFilter()
  const config = useConfig()
  const colors = randomColor({
    luminosity: 'dark',
    count: 5,
    seed: 15158730,
  })
  return (
    <Grid item xs={12} sm={12}>
      <Paper className={styles.paper}>
        <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
          Commits over time
        </Typography>
        <LineChart
          width={1200}
          height={400}
          data={getData(changes, filter, config)}
          margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
        >
          <Tooltip labelFormatter={date => moment(date).format('dddd, MMMM Do')} />
          <XAxis dataKey="date" hide={true} />
          <CartesianGrid stroke="#f5f5f5" />
          <Line
            type="monotone"
            dataKey={(day: DayStats) => day.opened.length}
            stroke={colors[0]}
            yAxisId={0}
            name="New"
          />
          <Line
            type="monotone"
            dataKey={(day: DayStats) => day.closed.length}
            stroke={colors[1]}
            yAxisId={0}
            name="Merged"
          />
          <Line
            type="monotone"
            dataKey={(day: DayStats) => day.active.length}
            stroke={colors[4]}
            yAxisId={0}
            name="In Review"
          />
          <Legend height={48} />
        </LineChart>
      </Paper>
    </Grid>
  )
}
