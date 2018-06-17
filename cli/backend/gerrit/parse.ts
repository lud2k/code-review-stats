import {Change, Review, Comment} from '../models'
import {GerritChangeDetail, GerritMessage} from './gerrit-models'
import {Config} from '../../config'

const NB_COMMENTS_REGEX = new RegExp('^Patch Set (\\d+)\:\n\n\\((\\d+) comments?\\).*')
const CODE_REVIEW_REGEX = new RegExp('^Patch Set (\\d+)\: Code-Review([-+]\\d+).*')
const CODE_REVIEW_AND_COMMENTS_REGEX =
    new RegExp('^Patch Set (\\d+): Code-Review([-+]\\d+)\n\n\\((\\d+) comments?\\).*')

export const parseChanges = (config: Config, changes: GerritChangeDetail[]): Change[] => {
    return changes.map((change) => parseChange(config, change))
}

export const parseChange = (config: Config, change: GerritChangeDetail): Change => {
    return {
        id: change._number,
        project: change.project,
        branch: change.branch,
        subject: change.subject,
        owner: change.owner,
        status: change.status,
        created: new Date(change.created),
        updated: new Date(change.updated),
        insertions: change.insertions,
        deletions: change.deletions,
        mergeable: change.mergeable,
        reviews: parseReviews(change.messages),
        comments: parseComments(change.messages),
        url: `${config.host}/#/c/${change._number}/`,
    }
}

export const parseReviews = (messages: GerritMessage[]): Review[] => {
    const ret: Review[] = []
    messages.forEach((message) => {
        const match = CODE_REVIEW_REGEX.exec(message.message)
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                score: parseInt(match[2], 10),
                patchset: message._revision_number,
            })
        }
    })
    return ret
}

export const parseComments = (messages: GerritMessage[]): Comment[] => {
    const ret: Comment[] = []
    messages.forEach((message) => {
        let match = NB_COMMENTS_REGEX.exec(message.message)
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                count: parseInt(match[2], 10),
                patchset: message._revision_number,
            })
        }
        match = CODE_REVIEW_AND_COMMENTS_REGEX.exec(message.message)
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                count: parseInt(match[3], 10),
                patchset: message._revision_number,
            })
        }
    })
    return ret
}
