import {Change, Review, Comment} from '../../cli/backend/models'

export interface UserStats {
    selfReviews: Review[]
    selfComments: Comment[]
    receivedMinus2: Review[]
    receivedMinus1: Review[]
    receivedPlus1: Review[]
    receivedPlus2: Review[]
    receivedComments: Comment[]
    givenMinus2: Review[]
    givenMinus1: Review[]
    givenPlus1: Review[]
    givenPlus2: Review[]
    givenComments: Comment[]
    changes: Change[]
    reviewedChanges: Change[]
    commentedChanges: Change[]
}

export interface DayStats {
    date: string
    reviews: Review[]
    comments: Comment[]
    changes: Set<string>
    opened: Change[]
    closed: Change[]
}

export interface ProjectStats {
    name: string
    changes: Change[]
}

export interface UserStatsMap {
    [username: string]: UserStats
}

export interface DailyStatsMap {
    [date: string]: DayStats
}

export interface ProjectStatsMap {
    [name: string]: ProjectStats
}

export interface Stats {
    users: UserStatsMap
    daily: DailyStatsMap
    projects: ProjectStatsMap
}

export interface Filter {
    usernames: string[]
}
