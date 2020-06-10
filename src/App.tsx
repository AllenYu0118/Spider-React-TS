import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import LoginPage from './Pages/Login'

export default () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}