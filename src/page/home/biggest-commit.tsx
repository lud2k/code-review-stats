
import * as React from 'react'
import {Change} from '../../../cli/backend/models'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import {Config} from '../../../cli/config'

const styles = require('./biggest-commit.css')

export class BiggestCommit extends React.Component<{ changes: Change[], config: Config }, {}> {
    getBiggestChange(): Change {
        const {changes} = this.props
        let biggestChange: Change = changes[0]
        changes.forEach((change) => {
            if (change.insertions+change.deletions > biggestChange.insertions+biggestChange.deletions) {
                biggestChange = change
            }
        })
        return biggestChange
    }

    render() {
        const {config} = this.props
        const change = this.getBiggestChange()
        return (
            <Grid item xs={12} sm={4}>
                <Paper className={styles.paper}>
                    <div className={styles.content}>
                        <p>
                            The biggest change was submitted by <b>{change.owner.username}</b>!
                        </p>
                        <p>
                            <a href={change.url} target='_blank'>{change.subject}</a> had {change.deletions} deletions
                            and {change.insertions} insertions.
                        </p>
                    </div>
                </Paper>
            </Grid>
        )
    }
}
