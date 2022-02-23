/* STATEFUL CLASS COMPONENT */

import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {
    // Initialize state to store course data and errors (if any)
    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            userId: '',
            errors: [],
        };
    }

    // Call componentDidMount() to fetch course data and update state and conditionally render UpdateCourse component
    // Note: this will be called immediately after UpdateCourse component is added to DOM
    componentDidMount() {
        // Extract authenticatedUser state from this.props (passed down from Context & props)
        const { context } = this.props;
        const authUser = context.authenticatedUser;

        // Declare var to store url param 'id'
        const currentURL = window.location.href;
        const urlParam = currentURL.substring(30, 32);

        // Fetch course detail
        // fetch(`http://localhost:5000/api/courses/${urlParam}`)
           fetch(`http://localhost:8001/api/courses/${urlParam}`) // new port 8001
            // Parse response to JSON
            .then((response) => response.json())
            // Assign response data to course props
            .then(data => { 
                const {
                    id, 
                    title,
                    description,
                    estimatedTime,
                    materialsNeeded,
                    userId
                } = data.course;
                // If authorized user ID matches user ID of fetched course, update course state
                if (authUser.userId === userId) {
                    return this.setState({
                        id: id,
                        title: title,
                        description: description,
                        estimatedTime: estimatedTime,
                        materialsNeeded: materialsNeeded,
                        userId: userId,
                        errors: ''
                    });
                } else {
                    // If match is false, push to history stack and redirect user to '/forbidden' (E.C. #1)
                    this.props.history.push('/forbidden');
                }
                // LOG STATEMENTS
                // console.log(authUser.userId);
                // console.log(userId);
            })
            // Catch any errors thrown from the fetch call (E.C. #1)
            .catch( error => {
                if (error) {
                    // Redirect user to '/notfound' if course could not be fetched (E.C. #1)
                    this.props.history.push('/notfound');
                    console.log(error);
                    return this.setState({
                        errors: error
                    })
                }
            });
    }

    render() {
        // Extract authenticatedUser state from this.props (passed down from Context & props)
        const { context } = this.props;
        const authUser = context.authenticatedUser;

        // Mark up of Update Course form
        return (
            <div className="wrap">
                <h2>Update Course</h2>
                {/* Render child component <Form> to display validation errors if any */}
                <Form
                    cancel={this.cancel}
                    errors={this.state.errors}
                    submit={this.submit}
                    submitButtonText="Update Course"
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
                                    value={this.state.title}
                                    onChange={this.change} />

                                    {/* Render instructor name via Context component */}
                                    <p>By {authUser.firstName} {authUser.lastName}</p> 

                                    <label htmlFor="description">Course Description</label>
                                    <textarea 
                                    id="description" 
                                    name="description"
                                    type="text"
                                    value={this.state.description}
                                    onChange={this.change} />
                                </div>
                                <div>
                                    <label htmlFor="estimatedTime">Estimated Time</label>
                                    <input 
                                    id="estimatedTime" 
                                    name="estimatedTime" 
                                    type="text" 
                                    value={this.state.estimatedTime}
                                    onChange={this.change} />

                                    <label htmlFor="materialsNeeded">Materials Needed</label>
                                    <textarea 
                                    id="materialsNeeded" 
                                    name="materialsNeeded"
                                    type="text"
                                    value={this.state.materialsNeeded}
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

    // submit() function updates course associated with authenticated user
    submit = () => {
        // Declare var to store url param 'id'
        const currentURL = window.location.href;
        const urlParam = currentURL.substring(30, 32);

        // Destructure props to extract context from this.props
        const { context } = this.props;

        // Store props in separate vars
        const authEmail = context.emailAddress;
        const authPass = context.password;

        // Destructure state object and unpack the following:
        const {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        } = this.state;

        // Define and store updated course data entered by authenticated user
        // Note: Updated course data will be passed to updateCourse() function in <Data> component
        const course = {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        };

        // Call updateCourse() and pass in new course data AND authenticated user's credentials
        // Note: User credentials MUST PASS auth-handler middleware in api
        context.data.updateCourse(urlParam, course, authEmail, authPass)
            .then( errors => { // chain then() to see if api returns status 400 and validation errors array
                if (errors.length) { // if validation errors are present
                    this.setState({ errors }); // update errors state to returned errors from api
                    // LOG STATEMENT
                    // console.log(errors);
                } else { // else if new course is successfully updated and sent to api, display log msg:
                    console.log(`${title} is successfully updated!`);
                    this.props.history.push(`/courses/${urlParam}`);
                }
            })
            .catch( error => { // handle errors (rejected promises) from server side (E.C. #1)
                console.log(error);
                this.props.history.push('/error');
            })
        
        // LOG STATEMENTS
        // console.log(course);
        // console.log(title);
        // console.log(authUser);
        // console.log(authEmail);
        // console.log(authPass);
        // console.log(userId);
        // console.log(id);
    }

    // cancel() function pushes '/courses/:id' to history stack and re-directs user
    cancel = () => {
        this.props.history.push(`/courses/${this.state.id}`);
    }
}




