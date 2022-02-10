/* STATEFUL CLASS COMPONENT */

import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
    // Initialize state to store new course data and errors (if any)
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            errors: [],
        };
    }

    render() {
        // Update state in object with new course data or errors (if any)
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        // Extract authenticatedUser state from this.props (passed down from Context & props)
        const { context } = this.props;
        const authUser = context.authenticatedUser;

        // Mark up of Create Course page
        return (
            <div className="wrap">
                <h2>Create Course</h2>
                {/* Render child component <Form> to display validation errors if any */}
                <Form
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
                    // Note: The elements prop value is a function that returns the form's input fields
                    elements={() => (
                        <React.Fragment>
                            <div className="main--flex">
                                <div>
                                    <label htmlFor="title">Course Title</label>
                                    <input 
                                    id="title" 
                                    name="title" 
                                    type="text" 
                                    value={title}
                                    onChange={this.change} />

                                    {/* Render instructor name via Context component */}
                                    <p>By {authUser.firstName} {authUser.lastName}</p> 

                                    <label htmlFor="description">Course Description</label>
                                    <textarea 
                                    id="description" 
                                    name="description"
                                    type="text"
                                    value={description}
                                    onChange={this.change} />
                                </div>
                                <div>
                                    <label htmlFor="estimatedTime">Estimated Time</label>
                                    <input 
                                    id="estimatedTime" 
                                    name="estimatedTime" 
                                    type="text" 
                                    value={estimatedTime}
                                    onChange={this.change} />

                                    <label htmlFor="materialsNeeded">Materials Needed</label>
                                    <textarea 
                                    id="materialsNeeded" 
                                    name="materialsNeeded"
                                    type="text"
                                    value={materialsNeeded}
                                    onChange={this.change} />
                                </div>
                            </div>
                        </React.Fragment>
                    )} />
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

    // submit() function creates new course associated with authenticated user
    submit = () => {
        // Destructure props to extract context from this.props
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        const userId = authUser.userId;
        const authEmail = context.emailAddress;
        const authPass = context.password;

        // Destructure state object and unpack the following:
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        } = this.state;

        // Define new course data entered by authenticated user (including context data)
        // Note: New course data will be passed to createCourse() function inside <Data> component
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        };

        // Call createCourse() and pass in new course data AND authenticated user's credentials
        // Note: User credentials MUST PASS auth-handler middleware in api
        context.data.createCourse(course, authEmail, authPass)
            .then( errors => { // chain then() to see if api returns status 400 and errors array
                if (errors.length) { // if errors are present
                    this.setState({ errors }); // update errors state to returned errors from api
                } else { // else if new course is successfully created and sent to api, display log msg:
                    console.log(`${title} is successfully added!`);
                    this.props.history.push('/');
                }
            })
            .catch( error => { // handle errors (rejected promises) from server side (E.C. #1)
                console.log(error);
                this.props.history.push('/error');
            })
    
        // LOG STATEMENTS
        // console.log(course);
        // console.log(authUser);
        // console.log(authEmail);
        // console.log(authPass);
        // console.log(userId);
    }

    // cancel() function re-directs user back to '/' when cancel button clicked
    cancel = () => {
        this.props.history.push('/');
    }
}





