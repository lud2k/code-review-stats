
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {Change, Data} from '../../../cli/backend/models'
import {Filter, Stats} from '../../model/models'
import {Title} from '../common/title'
import Grid from 'material-ui/Grid'
import {GivenReviews} from './given-reviews'
import {Commits} from './commits'
import {CommitsOverTime} from './commits-over-time'
import {CommitsGraph} from './commits-graph'
import {ProjectsPie} from './projects-pie'
import {ProjectsActivity} from './projects-activity'
import {BiggestCommit} from './biggest-commit'
import {MostReviews} from './most-reviews'
import {MostReviewsUser} from './most-reviews-user'
import {FilterButton} from './filter-button'
import {Config} from '../../../cli/config'

const styles = require('./home.css')

export class Content extends React.Component<{ changes: Change[], stats: Stats, config: Config }, {}> {
    render() {
        const {config, changes, stats} = this.props
        if (!changes || !stats) {
            return null
        }

        return (
            <Grid container spacing={24}>
                <BiggestCommit config={config} changes={changes} />
                <MostReviews config={config} changes={changes} />
                <MostReviewsUser stats={stats} config={config} />
                <br />
                <ProjectsPie stats={stats} config={config} />
                <ProjectsActivity stats={stats} config={config} />
                <br />
                <GivenReviews stats={stats} config={config} />
                <br />
                <Commits stats={stats} config={config} />
                <br />
                <CommitsOverTime stats={stats} config={config} />
                <br />
                <CommitsGraph changes={changes} />
            </Grid>
        )
    }
}

export class Home extends React.Component<{ data: Data, changes: Change[], filteredChanges: Change[], stats: Stats,
    filter: Filter, config: Config }, {}> {

    render() {
        const {config, changes, filter, filteredChanges, stats} = this.props
        return (
            <div className={styles.home}>
                <AppBar position='static'>
                    <Toolbar>
                        <Title config={config} />
                        <FilterButton stats={stats} filter={filter} config={config} changes={changes} />
                    </Toolbar>
                </AppBar>
                <div className={styles.content}>
                    <Content stats={stats} config={config} changes={filteredChanges} />
                </div>
            </div>
        )
    }
}
