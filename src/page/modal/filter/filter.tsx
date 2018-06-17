
import * as React from 'react'
import Button from 'material-ui/Button'
import {store} from '../../../redux/store'
import {setFilter} from '../../../redux/actions'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import {Change} from '../../../../cli/backend/models'
import {Filter} from '../../../model/models'
import Checkbox from 'material-ui/Checkbox'
import List, {ListItem, ListItemText} from 'material-ui/List'

const styles = require('./filter.css')

export class FilterModal extends React.Component<{ open: boolean, changes: Change[], onClose: () => void,
    filter: Filter }, { usernames: Set<string> }> {

    constructor(props: any) {
        super(props)

        this.state = { usernames: new Set() }
    }

    componentDidUpdate(prevProps: any) {
        const {open, filter } = this.props
        if (prevProps.open !== open) {
            this.setState({
                usernames: filter ? new Set(filter.usernames) : new Set(),
            })
        }
    }

    onClickFilter = () => {
        const usernames = Array.from(this.state.usernames)
        const filter = { usernames }
        try {
            localStorage.setItem('filter', JSON.stringify(filter))
        } catch (e) {
            console.error('Failed to save new filter', filter, e)
        }
        store.dispatch(setFilter(filter))
        this.props.onClose()
    }

    onClickCancel = () => {
        this.props.onClose()
    }

    onClickItem = (username: string) => () => {
        const {usernames} = this.state
        if (usernames.has(username)) {
            usernames.delete(username)
        } else {
            usernames.add(username)
        }
        this.setState({ usernames })
    }

    addUsernames(usernames: Set<string>, changes: Change[]) {
        changes.forEach((change) => {
            usernames.add(change.owner.username)
            change.reviews.forEach((review) => {
                usernames.add(review.author.username)
            })
            change.comments.forEach((comment) => {
                usernames.add(comment.author.username)
            })
        })
    }

    render() {
        const {open, onClose, changes} = this.props
        const usernames = new Set(this.state.usernames)
        this.addUsernames(usernames, changes)
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle id='form-dialog-title'>Filter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pick the users to filter the stats by. Only changes owned and reviewed by those users will be
                        kept for the stats.
                    </DialogContentText>
                    <div className={styles.inputs}>
                        <List>
                            {Array.from(usernames).sort().map((username: string) => (
                                <ListItem key={username} dense button onClick={this.onClickItem(username)}
                                          className={styles.listItem}>
                                    <Checkbox checked={this.state.usernames.has(username)} tabIndex={-1}
                                              disableRipple className={styles.checkbox} />
                                    <ListItemText primary={username} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color='default' onClick={this.onClickCancel}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={this.onClickFilter}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
