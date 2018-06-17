
import * as React from 'react'
import {Stats} from '../../model/models'
import {Change} from '../../../cli/backend/models'
import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
import * as _ from 'lodash'
import {Config} from '../../../cli/config'

const styles = require('./most-reviews-user.css')

export class MostReviewsUser extends React.Component<{ stats: Stats, config: Config }, {}> {
    getMostReviewsUser(): {username: string, changes: Change[]} {
        const {stats} = this.props
        let mostReviewsUsername: string
        _.forEach(stats.users, (stat, username) => {
            if (!mostReviewsUsername ||
                stat.commentedChanges.length > stats.users[mostReviewsUsername].commentedChanges.length) {
                mostReviewsUsername = username
            }
        })
        return {username: mostReviewsUsername, changes: stats.users[mostReviewsUsername].commentedChanges}
    }

    getLastReviewed(username: string, changes: Change[]): Change {
        let lastChange = null
        let lastDate: Date = null
        changes.forEach((change) => {
            const comments = change.comments.filter((comment) => comment.author.username === username)
            if (!lastDate || _.last(comments).date > lastDate) {
                lastDate = _.last(comments).date
                lastChange = change
            }
        })
        return lastChange
    }

    render() {
        const {username, changes} = this.getMostReviewsUser()
        const lastReviewedChanged = this.getLastReviewed(username, changes)
        return (
            <Grid item xs={12} sm={4}>
                <Paper className={styles.paper}>
                    <div className={styles.content}>
                        <p>
                            <b>{username}</b> commented on the most commits! Reviewing {changes.length} changes.
                        </p>
                        <p>
                            The last commit commented on was <a href={lastReviewedChanged.url} target='_blank'>
                            {lastReviewedChanged.subject}
                            </a>
                        </p>
                    </div>
                </Paper>
            </Grid>
        )
    }
}
