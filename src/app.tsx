
import * as React from 'react'
import {HashRouter} from 'react-router-dom'
import {Routes} from './routes'
import {store} from './redux/store'
import {setConfig, setData, setFilter} from './redux/actions'
import {Filter, Stats} from './model/models'
import {Config} from '../cli/config'
import {Change, Data} from '../cli/backend/models'

const styles = require('./app.css')

export class App extends React.Component<{}, { data?: Data, stats?: Stats, changes?: Change[],
    config?: Config, filteredChanges?: Change[], filter?: Filter }> {

    constructor(props: any) {
        super(props)
        this.state = {}
    }

    /**
     * When dates are stringified they become strings. we need to convert them back to dates.
     */
    fixDates(data: Data) {
        data.changes.forEach((change) => {
            change.updated = new Date(change.updated)
            change.created = new Date(change.created)
            change.reviews.forEach((review) => {
                review.date = new Date(review.date)
            })
            change.comments.forEach((comment) => {
                comment.date = new Date(comment.date)
            })
        })
        return data
    }

    async componentDidMount() {
        // Update the state when the store is changed
        store.subscribe(() => {
            this.setState(store.getState())
        })

        const {data, config} = window
        store.dispatch(setConfig(config))
        store.dispatch(setData(this.fixDates(data)))
        if (config.users.length > 0) {
            store.dispatch(setFilter({
                usernames: config.users,
            }))
        }
    }

    renderContent() {
        const {data, stats, changes, filteredChanges, filter, config} = this.state
        if (!data || !config) {
            return (
                <div className='error'>
                    <p>
                        Ooops, something went wrong.<br />Data or config is missing from the page.
                    </p>
                </div>
            )
        }

        return (
            <div className='root'>
                <Routes data={data} stats={stats} changes={changes} filteredChanges={filteredChanges}
                        config={this.state.config} filter={filter} />
            </div>
        )
    }

    render() {
        return (
            <HashRouter basename='/'>
                <div className={styles.app}>
                    {this.renderContent()}
                </div>
            </HashRouter>
        )
    }
}
