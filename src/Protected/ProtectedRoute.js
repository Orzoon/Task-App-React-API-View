import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import {Authentication} from '../helper/helper'

const ProtectedRoute = ({component: Component, logoutController ,...rest}) => (
    <Route {...rest} render={(props) => (
       Authentication.loggedIn === true
          ? <Component {...props}  logoutController = {logoutController}/>
          : <Redirect to= '/' />
      )} />
)

export default ProtectedRoute;
