
import * as React from 'react'
import {Change} from '../../../cli/backend/models'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import {Config} from '../../../cli/config'

const styles = require('./most-reviews.css')

export class MostReviews extends React.Component<{ changes: Change[], config: Config }, {}> {
    getMostReviewsChange(): Change {
        const {changes} = this.props
        let biggestChange: Change = changes[0]
        changes.forEach((change) => {
            if (change.comments.length > biggestChange.comments.length) {
                biggestChange = change
            }
        })
        return biggestChange
    }

    render() {
        const {config} = this.props
        const change = this.getMostReviewsChange()
        return (
            <Grid item xs={12} sm={4}>
                <Paper className={styles.paper}>
                    <div className={styles.content}>
                        <p>
                            The change with the most comments was submitted by <b>{change.owner.username}</b>!
                        </p>
                        <p>
                            <a href={change.url} target='_blank'>{change.subject}</a> received {change.comments.length}
                            &nbsp;comments.
                        </p>
                    </div>
                </Paper>
            </Grid>
        )
    }
}
