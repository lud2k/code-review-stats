import * as React from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import { Title } from '../common/title'
import * as styles from './not-found.css'

export const NotFound: React.FunctionComponent = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Title section="Not Found" />
        </Toolbar>
      </AppBar>
      <div className={styles.notFound}>Ooops! The page you are looking for does not exist.</div>
    </div>
  )
}
