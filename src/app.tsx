import * as React from 'react'
import { HashRouter } from 'react-router-dom'
import { Routes } from './routes'
import { store } from './redux/store'
import * as styles from './app.css'
import { Provider } from 'react-redux'
import { useChanges, useConfig } from './redux/seletors'

export const AppContent: React.FunctionComponent = () => {
  const config = useConfig()
  const changes = useChanges()

  if (!changes || !config) {
    return (
      <div className={styles.error}>
        <p>
          Ooops, something went wrong.
          <br />
          Data or config is missing from the page.
        </p>
      </div>
    )
  }

  return <Routes />
}

export const App: React.FunctionComponent = () => {
  return (
    <HashRouter basename="/">
      <Provider store={store}>
        <div className={styles.app}>
          <AppContent />
        </div>
      </Provider>
    </HashRouter>
  )
}
