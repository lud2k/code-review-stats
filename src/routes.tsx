
import * as React from 'react'
import {Route} from 'react-router-dom'
import {NotFound} from './page/notfound/not-found'
import {Switch} from 'react-router'
import {Filter, Stats} from './model/models'
import {Home} from './page/home/home'
import {Config} from '../cli/config'
import {Change, Data} from '../cli/backend/models'

export class Routes extends React.Component<{ data: Data, changes: Change[],
    filteredChanges: Change[], stats: Stats, filter: Filter, config: Config }, {}> {

    render() {
        const {data, stats, filteredChanges, filter, changes, config} = this.props
        return (
            <div>
                <Switch>
                    <Route path='/' exact render={({ match }) => {
                        return <Home data={data} stats={stats} filter={filter} changes={changes}
                                     filteredChanges={filteredChanges} config={config} />
                    }} />
                    <Route render={({ match }) => <NotFound config={config} />} />
                </Switch>
            </div>
        )
    }
}
