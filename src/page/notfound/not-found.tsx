
import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import {Title} from '../common/title'
import {Config} from '../../../cli/config'

const styles = require('./not-found.css')

export class NotFound extends React.Component<{ config: Config }, {}> {
  render() {
    const {config} = this.props
    return (
      <div>
        <AppBar position='static'>
          <Toolbar>
            <Title config={config} section='Not Found' />
          </Toolbar>
        </AppBar>
        <div className={styles.notFound}>
        Ooops! The page you are looking for does not exist.
        </div>
      </div>
    )
  }
}
