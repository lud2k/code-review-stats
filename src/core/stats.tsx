import {
    UserStats, UserStatsMap, Stats, DayStats, DailyStatsMap, ProjectStatsMap,
} from '../model/models'
import * as _ from 'lodash'
import {Change} from '../../cli/backend/models'
import * as moment from 'moment'

export const createUserStats = (): UserStats => {
    return {
        selfReviews: [],
        selfComments: [],
        receivedMinus2: [],
        receivedMinus1: [],
        receivedPlus1: [],
        receivedPlus2: [],
        receivedComments: [],
        givenMinus2: [],
        givenMinus1: [],
        givenPlus1: [],
        givenPlus2: [],
        givenComments: [],
        changes: [],
        reviewedChanges: [],
        commentedChanges: [],
    }
}

export const computeStats = (changes: Change[]): Stats => {
    return {
        users: computeUserStats(changes),
        daily: computeDailyStats(changes),
        projects: computeProjectStats(changes),
    }
}

export const computeUserStats = (changes: Change[]): UserStatsMap => {
    const ret: UserStatsMap = {}
    const get = (username: string) => {
        if (!ret[username]) {
            ret[username] = createUserStats()
        }
        return ret[username]
    }

    changes.forEach((change) => {
        const usersCommentedChange = new Set()
        const usersReviewedChange = new Set()
        get(change.owner.username).changes.push(change)
        change.reviews.forEach((review) => {
            if (review.author.username === change.owner.username) {
                get(change.owner.username).selfReviews.push(review)
            } else if (review.score === -2) {
                get(change.owner.username).receivedMinus2.push(review)
                get(review.author.username).givenMinus2.push(review)
                usersReviewedChange.add(review.author.username)
            } else if (review.score === -1) {
                get(change.owner.username).receivedMinus1.push(review)
                get(review.author.username).givenMinus1.push(review)
                usersReviewedChange.add(review.author.username)
            }  else if (review.score === +1) {
                get(change.owner.username).receivedPlus1.push(review)
                get(review.author.username).givenPlus1.push(review)
                usersReviewedChange.add(review.author.username)
            }  else if (review.score === +2) {
                get(change.owner.username).receivedPlus2.push(review)
                get(review.author.username).givenPlus2.push(review)
                usersReviewedChange.add(review.author.username)
            }
        })
        change.comments.forEach((comment) => {
            if (comment.author.username === change.owner.username) {
                get(change.owner.username).selfComments.push(comment)
            } else {
                get(change.owner.username).receivedComments.push(comment)
                get(comment.author.username).givenComments.push(comment)
                usersCommentedChange.add(comment.author.username)
            }
        })
        usersReviewedChange.forEach((username: string) => {
            get(username).reviewedChanges.push(change)
        })
        usersCommentedChange.forEach((username: string) => {
            get(username).commentedChanges.push(change)
        })
    })
    return ret
}

export const createDayStats = (date: string): DayStats => {
    return {
        date,
        opened: [],
        closed: [],
        reviews: [],
        comments: [],
        changes: new Set(),
    }
}

export const computeDailyStats = (changes: Change[]): DailyStatsMap => {
    const ret: DailyStatsMap = {}
    const get = (date: Date) => {
        const dateString = moment(date).format('YYYY-MM-DD')
        if (!ret[dateString]) {
            ret[dateString] = createDayStats(dateString)
        }
        return ret[dateString]
    }

    changes.forEach((change) => {
        change.reviews.forEach((review) => {
            get(review.date).reviews.push(review)
        })
        change.comments.forEach((comment) => {
            get(comment.date).comments.push(comment)
        })
        if (change.status === 'ABANDONED' || change.status === 'MERGED') {
            get(change.created).opened.push(change)
            get(change.updated).closed.push(change)
        } else if (change.status === 'NEW' || change.status === 'DRAFT') {
            get(change.created).opened.push(change)
        }
    })

    const dates = _.keys(ret).sort()
    dates.forEach((date, index) => {
        const dayStats = ret[date]
        const prevDayStats = ret[dates[index-1]]
        if (index > 0) {
            dayStats.changes = new Set(prevDayStats.changes.values())
        }
        dayStats.opened.forEach((change) => dayStats.changes.add(change.id))
        dayStats.closed.forEach((change) => dayStats.changes.delete(change.id))
    })

    return ret
}

export const computeProjectStats = (changes: Change[]): ProjectStatsMap => {
    const ret: ProjectStatsMap = {}
    const get = (name: string) => {
        if (!ret[name]) {
            ret[name] = {
                name,
                changes: [],
            }
        }
        return ret[name]
    }

    changes.forEach((change) => {
        get(change.project).changes.push(change)
    })

    return ret
}
