/* HIGHER-ORDER COMPONENT (HOC): */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// PrivateRoute function component wraps a specified <Route> and redirects to login page IF NOT authenticated
export default function PrivateRoute({ component: Component, ...rest }) { // inside parameter, destructure and rename component and collect any props passed to it
    return (
        // Consumer tags subscribes PrivateRoute component to all context, actions and data
        <Consumer>
          {context => (
            <Route
              {...rest}
              render={props => context.authenticatedUser ? ( // check to see if there's authenticated user in state
                  <Component {...props} /> // if true, component passed into PrivateRoute funcion gets rendered
                ) : (
                  <Redirect to={{ // if false, redirect to '/signin'
                    pathname: '/signin',
                    state: { from: props.location }, // (E.C. #3) store state property of user's current 'location' (if authenticated, user will be re-directed to previous location) 
                  }} />
                )
              }
            />
        )}
        </Consumer>
    );
}




