
export interface User {
    name: string
    email: string
    username: string
}

export interface Review {
    id: string
    author: User
    date: Date
    score: number
    patchset: number
}

export interface Comment {
    id: string
    author: User
    date: Date
    count: number
    patchset: number
}

export type ChangeType = 'NEW' | 'DRAFT' | 'ABANDONED' | 'MERGED'

export interface Change {
    id: string
    project: string
    branch: string
    subject: string
    owner: User
    status: ChangeType
    created: Date
    updated: Date
    insertions: number
    deletions: number
    mergeable: boolean
    reviews: Review[]
    comments: Comment[]
    url: string
}

export interface Data {
    changes: Change[]
}
