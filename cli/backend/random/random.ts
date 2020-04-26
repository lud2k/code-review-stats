import { Config } from '../../config'
import { Change, ChangeType, Comment, Data, Review, User } from '../models'
import * as moment from 'moment'
import * as _ from 'lodash'

export const USERS = [
  'Cordie',
  'Priscilla',
  'Myrna',
  'Margarette',
  'Delmar',
  'Liliana',
  'Philip',
  'Regine',
  'Oma',
  'Ashlee',
  'Janette',
  'Alvaro',
  'Benito',
  'Jenette',
  'Flora',
  'Scotty',
  'Else',
  'Bryant',
  'Treasa',
  'Jacquiline',
]
const PROJECTS = ['Proxy', 'Frontend', 'Backend', 'User', 'Authentication', 'Cache', 'Infra']
const MAX_COMMITS_PER_DAY = 5
const MIN_COMMITS_PER_DAY = 3
const MAX_REVIEWS_PER_COMMIT = 3
const MIN_REVIEWS_PER_COMMIT = 1

export const generateRandomData = async (config: Config): Promise<Data> => {
  return { changes: generateRandomChanges(config) }
}

const generateRandomChanges = (config: Config): Change[] => {
  const ret = []
  for (let i = 0; i < config.days; i++) {
    const created = moment().subtract(i, 'days')
    const updated = moment().subtract(i + _.random(i), 'days')
    const nbCommits = _.random(MIN_COMMITS_PER_DAY, MAX_COMMITS_PER_DAY)
    for (let j = 0; j < nbCommits; j++) {
      const user = _.sample(USERS)
      ret.push({
        id: i.toString(),
        project: getProject(user),
        branch: 'master',
        subject: `Commit ${i}-${j}`,
        owner: {
          name: user,
          email: `${user}@lud2k.github.com`,
          username: user,
        },
        status: getStatus(i),
        created: created.toDate(),
        updated: updated.toDate(),
        insertions: _.random(10, 500),
        deletions: _.random(10, 500),
        mergeable: true,
        reviews: generateRandomReviews(config, user, created, updated, i.toString()),
        comments: generateRandomComments(config, user, created, updated, i.toString()),
        url: '#',
      })
    }
  }
  return ret
}

const getProject = (user: string): string => {
  const index = USERS.indexOf(user)
  let projects = PROJECTS.slice(Math.round(index / 3) * 3, Math.round(index / 3) * 3 + 3)
  if (projects.length === 0) {
    projects = PROJECTS
  }
  return _.sample(projects)
}

const getReviewer = (user: string): string => {
  const index = USERS.indexOf(user)
  const users = USERS.slice(Math.max(0, index - 2), Math.min(USERS.length, index + 2))
  return _.sample(users)
}

const getStatus = (i: number): ChangeType => {
  const statuses: ChangeType[] = ['NEW']
  for (let j = 0; j < i * 2; j++) {
    statuses.push('MERGED')
  }
  return _.sample(statuses)
}

const generateRandomReviews = (
  config: Config,
  author: string,
  created: moment.Moment,
  updated: moment.Moment,
  changeId: string
): Review[] => {
  const ret = []
  const nbReviews = _.random(MIN_REVIEWS_PER_COMMIT, MAX_REVIEWS_PER_COMMIT)
  for (let j = 0; j < nbReviews; j++) {
    const user = getReviewer(author)
    ret.push({
      id: j.toString(),
      author: {
        name: user,
        email: `${user}@lud2k.github.com`,
        username: user,
      },
      date: created.toDate(),
      score: _.sample([-1, 1, 0, 2]),
      patchset: _.random(0, 10),
      changeId,
    })
  }
  return ret
}

const generateRandomComments = (
  config: Config,
  author: string,
  created: moment.Moment,
  updated: moment.Moment,
  changeId: string
): Comment[] => {
  const ret = []
  const nbReviews = _.random(MIN_REVIEWS_PER_COMMIT, MAX_REVIEWS_PER_COMMIT)
  for (let j = 0; j < nbReviews; j++) {
    const user = getReviewer(author)
    ret.push({
      id: j.toString(),
      author: {
        name: user,
        email: `${user}@lud2k.github.com`,
        username: user,
      },
      date: created.toDate(),
      count: _.random(1, 6),
      patchset: _.random(0, 10),
      changeId,
    })
  }
  return ret
}
