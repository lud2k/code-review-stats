
export interface GerritUser {
    _account_id: number
    name: string
    email: string
    username: string
}

export interface GerritMessage {
    author: GerritUser
    date: string
    id: string
    message: string
    _revision_number: number
}

export interface GerritCommiter {
    name: string
    email: string
    date: string
    tz: number
}

export interface GerritCommit {
    committer: GerritCommiter
    message: string
    subject: string
}

export interface GerritRevision {
    commit: GerritCommit
    created: string
    uploader: GerritUser
    _number: number
}

export interface GerritRevisionsMap {
    [id: string]: GerritRevision
}

export interface GerritChangeSummary {
    id: string
    project: string
    branch: string
    change_id: string
    subject: string
    status: string
    created: string
    updated: string
    mergeable: boolean
    insertions: number
    deletions: number
    owner: GerritUser
    _number: number
}

export interface GerritChangeDetail {
    id: string
    project: string
    branch: string
    change_id: string
    _number: string,
    subject: string
    status: GerritChangeType
    created: string
    updated: string
    mergeable: boolean
    insertions: number
    deletions: number
    messages: GerritMessage[]
    owner: GerritUser
    revisions: GerritRevisionsMap
}

export type GerritChangeType = 'NEW' | 'DRAFT' | 'ABANDONED' | 'MERGED'
