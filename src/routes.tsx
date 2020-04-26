import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { NotFound } from './page/notfound/not-found'
import { Home } from './page/home/home'
import { User } from './page/user/user'
import { Project } from './page/project/project'

export const Routes: React.FunctionComponent = () => {
  return (
    <div>
      <Switch>
        <Route path="/" exact render={() => <Home />} />
        <Route
          path="/users/:username"
          render={({ match }) => <User username={match.params.username} />}
        />
        <Route
          path="/projects/:projectName(.*)"
          render={({ match }) => <Project projectName={match.params.projectName} />}
        />
        <Route render={() => <NotFound />} />
      </Switch>
    </div>
  )
}
