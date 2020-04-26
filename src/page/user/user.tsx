import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { AppBar, Toolbar, Grid, IconButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Title } from '../common/title'
import { GivenReviews } from './given-reviews'
import * as styles from './user.css'
import { ReceivedReviews } from './received-reviews'
import { useUser } from '../../redux/seletors'

export const User: React.FunctionComponent<{ username: string }> = ({ username }) => {
  const history = useHistory()
  const name = useUser(username)?.name ?? username

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => history.push('/')}
          >
            <ArrowBack />
          </IconButton>
          <Title section="User" subSection={name} />
        </Toolbar>
      </AppBar>
      <Grid className={styles.content}>
        <GivenReviews username={username} />
        <br />
        <ReceivedReviews username={username} />
      </Grid>
    </div>
  )
}
