/* CONTEXT CLASS COMPONENT: */

import React, { Component } from 'react';
import Cookies from 'js-cookie'; // import JavaScript cookie library (E.C. #2)
import Data from './Data'; // import Data.js containing helper class

const Context = React.createContext();

export class Provider extends Component {
  // Initialize new instance of Data class with data, cookie and state props
  constructor() {
      super();
      this.data = new Data();
      this.cookie = Cookies.get('authenticatedUser'); // initialize cookie state (E.C. #2)
      this.state = {
        authenticatedUser: this.cookie ? JSON.parse(this.cookie) : null, // initial state will either be authenticatedUser cookie or null (E.C. #2)
        emailAddress: '',
        password: '',
        userId: ''
      };
  }

  render() {
    // Extract authenticatedUser, email, password from this.state
    const { 
      authenticatedUser,
      emailAddress,
      password,
      userId
    } = this.state;

    // Declare var 'value' to equal an object and assign it state, the utility methods and props of the Data class and context actions
    const value = {
        authenticatedUser,
        emailAddress,
        password,
        userId,   // add userId state to context value 
        data: this.data,
        actions: { // add the actions property and object
          signIn: this.signIn,
          signOut: this.signOut
        }
    };

    return (
    // Assign context Provider a value property equal to 'const value' to be shared throughout component tree
    <Context.Provider value={value}>
      {this.props.children}
    </Context.Provider>  
    );
  }

  // signIn() method retrieves registered user's credentials from api then logs them in upon submitting
  // Persist returned user's record and store user's password in global state
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    // If user is NOT null, update authenticatedUser state to value of user
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,       // set state of user
          emailAddress: emailAddress,    // set state of user's email
          password: password,            // set state of user's password
          userId: user.userId            // set state of user's ID
        };
      });
      // Set 'authenticatedUser' cookie to value stored in user object (E.C. #2)
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    return user;
  }

  // signOut() method removes authenticated user and password from global state and redirects user to '/'
  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser'); // remove 'authenticatedUser' cookie on signOut() (E.C. #2)
  }
}

export const Consumer = Context.Consumer;

/**
 * withContext(Component) is a higher-order component that wraps the provided component in a Context Consumer component.
 * It automatically subscribes the component passed to it all actions and context changes.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 **/

export default function withContext(Component) {
    return function ContextComponent(props) {
      return (
        <Context.Consumer>
          {context => <Component {...props} context={context} />}
        </Context.Consumer>
      );
    }
}








