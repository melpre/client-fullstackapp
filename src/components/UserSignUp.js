/* TODO: CHange this component into a function component */


/* STATEFUL CLASS COMPONENT */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
    // Initialize state of user credentials and errors
    constructor() {
        super();
        this.state = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            confirmPassword: '',
            errors: []
        };
    }

    render() {
        // Update state in user credentials object or errors (if any)
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errors
        } = this.state;

        // Mark up of Sign Up page
        return(
            <div className="form--centered">
                <h2>Sign Up</h2>
                {/* Render child component <Form> to display validation errors if any */}
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Sign Up"
                    // Note: The elements prop value is a function that returns the form's input fields
                    elements={() => (
                        <React.Fragment>
                            <label htmlFor="firstName">First Name</label>
                            <input 
                            id="firstName" 
                            name="firstName" 
                            type="text"
                            value={firstName} 
                            onChange={this.change} />

                            <label htmlFor="lastName">Last Name</label>
                            <input 
                            id="lastName" 
                            name="lastName" 
                            type="text"
                            value={lastName} 
                            onChange={this.change} />

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
                            
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword} 
                            onChange={this.change} />
                        </React.Fragment>
                    )} />
                <p>
                    Already have a user account? Click here to <NavLink to="/signin">sign in</NavLink>!
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

    // submit() function creates new user and sends credentials to api 
    submit = () => {
        // Destructure props to extract context from this.props
        const { context } = this.props;

        // Destructure state object and unpack the following:
        const {
            firstName,
            lastName,
            emailAddress,
            password,
        } = this.state;

        // Define new user credentials entered by user
        // New user credentials will be passed to createUser() function in <Data> component
        const user = {
        firstName,
        lastName,
        emailAddress,
        password
        };

        //Call createUser() and pass in new user credentials
        context.data.createUser(user)
            .then( errors => { // chain then() to see if api returns status 400 and errors array
                if (errors.length) { // if errors are present
                    this.setState({ errors }); // update errors state to returned errors from api
                } else { // else if user is successfully created and sent to api, display log msg:
                    console.log(`${emailAddress} is successfully signed up and authenticated!`);
                    context.actions.signIn(emailAddress, password) // sets authenticated user in state
                        .then(() => {
                            this.props.history.push('/')
                        });
                }
            })
            .catch( error => { // handle errors (rejected promises) from server side (E.C. #1)
                console.log(error);
                this.props.history.push('/error');
            })
    }

    // cancel() function re-directs user back to '/' when cancel button clicked
    cancel = () => {
        this.props.history.push('/');
    }
}
