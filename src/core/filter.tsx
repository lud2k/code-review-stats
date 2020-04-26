import { Filter } from '../model/models'
import { Change, Review, Comment } from '../../cli/backend/models'

export const getReviewsByUser = (
  changes: Change[],
  filter: Filter
): { [username: string]: { change: Change, review: Review }[] } => {
  const reviewsByUser: { [username: string]: { change: Change, review: Review }[] } = {}
  changes.forEach(change => {
    change.reviews.forEach(review => {
      if (
        filter.usernames.includes(review.author.username) &&
        change.owner.username !== review.author.username
      ) {
        if (!reviewsByUser[review.author.username]) {
          reviewsByUser[review.author.username] = []
        }
        reviewsByUser[review.author.username].push({change, review})
      }
    })
  })
  return reviewsByUser
}

export const getCommentsByUser = (
  changes: Change[],
  filter: Filter
): { [username: string]: Comment[] } => {
  const commentsByUser: { [username: string]: Comment[] } = {}
  changes.forEach(change => {
    change.comments.forEach(comment => {
      if (
        filter.usernames.includes(comment.author.username) &&
        change.owner.username !== comment.author.username
      ) {
        if (!commentsByUser[comment.author.username]) {
          commentsByUser[comment.author.username] = []
        }
        commentsByUser[comment.author.username].push(comment)
      }
    })
  })
  return commentsByUser
}
