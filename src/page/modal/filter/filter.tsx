import * as React from 'react'
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { setFilter } from '../../../redux/actions'
import * as styles from './filter.css'
import { useState } from 'react'
import {useChanges, useFilter} from '../../../redux/seletors'
import { useDispatch } from 'react-redux'
import {Change} from '../../../../cli/backend/models'

const getUsernames = (changes: Change[]): Set<string> => {
  return changes.reduce((ret, change) => {
    change.reviews.forEach(review => {
      ret.add(review.author.username)
    })
    change.comments.forEach(comment => {
      ret.add(comment.author.username)
    })
    ret.add(change.owner.username)
    return ret
  }, new Set<string>())
}

export const FilterModal: React.FunctionComponent<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const filter = useFilter()
  const changes = useChanges()
  const dispatch = useDispatch()
  const [selectedUsernames, setSelectedUserNames] = useState(new Set(filter.usernames))
  const usernames = getUsernames(changes)

  const onClickFilter = () => {
    dispatch(setFilter({ usernames: Array.from(selectedUsernames) }))
    onClose()
  }

  const onClickItem = (username: string) => () => {
    const updatedUsernames = new Set(selectedUsernames)
    if (updatedUsernames.has(username)) {
      updatedUsernames.delete(username)
    } else {
      updatedUsernames.add(username)
    }
    setSelectedUserNames(updatedUsernames)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">Filter</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick the users to filter the stats by. Only changes owned and reviewed by those users will
          be kept for the stats.
        </DialogContentText>
        <div>
          <List>
            {Array.from(usernames)
              .sort()
              .map((username: string) => (
                <ListItem
                  key={username}
                  dense
                  button
                  onClick={onClickItem(username)}
                  className={styles.listItem}
                >
                  <Checkbox
                    checked={selectedUsernames.has(username)}
                    tabIndex={-1}
                    disableRipple
                    className={styles.checkbox}
                  />
                  <ListItemText primary={username} />
                </ListItem>
              ))}
          </List>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onClickFilter}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
