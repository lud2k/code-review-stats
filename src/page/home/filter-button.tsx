
import * as React from 'react'
import {Change} from '../../../cli/backend/models'
import {Filter, Stats} from '../../model/models'
import Button from 'material-ui/Button'
import {store} from '../../redux/store'
import {setFilter} from '../../redux/actions'
import {FilterModal} from '../modal/filter/filter'
import {Config} from '../../../cli/config'

const styles = require('./filter-button.css')

export class FilterButton extends React.Component<{ changes: Change[], filter: Filter, stats: Stats, config: Config },
    { opened: boolean }> {

    constructor(props: any) {
        super(props)

        this.state = {
            opened: false,
        }
    }

    onClick = () => {
        this.setState({ opened:  true })
    }

    onCloseModal = () => {
        this.setState({ opened:  false })
    }

    getSummary() {
        const {filter} = this.props
        if (filter && filter.usernames.length > 0) {
            return `(${filter.usernames.length} users selected)`
        }
    }

    render() {
        const {filter, changes, stats} = this.props
        const {opened} = this.state
        if (!changes || !stats) {
            return null
        }

        return (
            <div>
                <Button color='inherit' onClick={this.onClick}>
                    Filter {this.getSummary()}
                </Button>
                <FilterModal open={opened} filter={filter} changes={changes} onClose={this.onCloseModal} />
            </div>
        )
    }
}
