import {Filter} from '../model/models'
import * as _ from 'lodash'
import {Change} from '../../cli/backend/models'

const checkOwner = (filter: Filter, change: Change): boolean => {
    return _.includes(filter.usernames, change.owner.username)
}

const checkCommenters = (filter: Filter, change: Change): boolean => {
    for (let i=0; i<change.reviews.length; i++) {
        if (_.includes(filter.usernames, change.reviews[i].author.username)) {
            return true
        }
    }
    return false
}

const checkReviewers = (filter: Filter, change: Change): boolean => {
    for (let i=0; i<change.reviews.length; i++) {
        if (_.includes(filter.usernames, change.reviews[i].author.username)) {
            return true
        }
    }
    return false
}

export const filterChanges = (filter: Filter, changes: Change[]): Change[] => {
    if (!filter || filter.usernames.length === 0 || !changes) {
        return changes
    }

    const ret = changes.filter((change) => {
        return checkOwner(filter, change)
            || checkReviewers(filter, change)
            || checkCommenters(filter, change)
    }).map((change) => {
        const ret2 = {...change}
        if (!checkOwner(filter, change)) {
            ret2.reviews = ret2.reviews.filter((review) => _.includes(filter.usernames, review.author.username))
            ret2.comments = ret2.comments.filter((comment) => _.includes(filter.usernames, comment.author.username))
        }
        return ret2
    })
    return ret
}
