/* TODO: CHange this component into a function component */


/* STATEFUL CLASS COMPONENT */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
    // Initialize state of user credentials and errors
    constructor() {
        super();
        this.state = {
            emailAddress: '',
            password: '',
            errors: []
        };
    }

    render() {
        // Update state in user credentials object or errors (if any)
        const {
            emailAddress,
            password,
            errors,
        } = this.state;
        
        // Mark up of Sign In page
        return (
            <div className="form--centered">
                <h2>Sign In</h2>
                <Form
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Sign In"

                    elements={() => (
                    <React.Fragment>
                        <label htmlFor="emailAddress">Email Address</label>
                        <input 
                        id="emailAddress" 
                        name="emailAddress" 
                        type="email" 
                        value={emailAddress} 
                        onChange={this.change} />
                        <label htmlFor="password">Password</label>
                        <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        value={password}
                        onChange={this.change} />
                    </React.Fragment>
                    )} />
                <p>
                    Don't have a user account? Click here to <NavLink to="/signup">sign up</NavLink>!
                </p>
            </div>
        );
    }

    // change() function updates elements and their values on change events
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    // submit() function logs in authenticated user upon submitting form
    submit = () => {
        // Destructure props to extract context from this.props
        const { context } = this.props;

        // (E.C. #3) Destructure 'from' and extract previous url path BEFORE being re-directed to '/signin' from un-authenticated user
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        // Destructure state object and unpack the following:
        const { emailAddress, password } = this.state;

        // Call signIn() method defined in Context and now avaiable to UserSignIn component
        context.actions.signIn(emailAddress, password)
            .then( user => {
                if (user === null) { // also means request status response is 401
                    this.setState(() => {
                        return { 
                            errors: [ 'Sign-in was unsuccessful' ],
                        };
                    });
                } else {
                    this.props.history.push(from); // push url path previously accessed before user was authenticated (E.C. #3)
                }
            })
            .catch( error => { // handle errors (rejected promises) from server side (E.C. #1)
                console.log(error);
                this.props.history.push('/error');
            })
        
        // LOG STATEMENTS
        // console.log(emailAddress);
        // console.log(password);
    }

    // cancel() function re-directs user back to '/' when cancel button clicked
    cancel = () => {
        this.props.history.push('/');
    }
}



