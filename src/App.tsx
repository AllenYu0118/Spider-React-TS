import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import LoginPage from './Pages/Login'
import RegisterPage from './Pages/Register'
import HomePage from './Pages/Home'

export default () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/register" exact component={RegisterPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}