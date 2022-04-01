/* STATEFUL FUNCTION COMPONENT */

// Import React libraries and hooks
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { NavLink, Redirect } from 'react-router-dom';

// Declare stateful function component to retrieve a course's details from API data
export default function CourseDetail(props) {
    // Extract context (now that CourseDetail is subscribed to Context) from props
    const { context } = props;

    // Store authenticated user data in new var 'authUser'
    const authUser = context.authenticatedUser;
    const authEmail = context.emailAddress;
    const authPass = context.password;

    // Define useState and store values
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [instructor, setInstructor] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(''); // define 'error' state

    // call useEffect() hook to update course state
    useEffect((props) => {
        async function fetchCourse()  {
            // Declare var to hold url param 'id'
            const currentURL = window.location.href;
            const urlParam = currentURL.substring(30);
            try {
                // const response = await fetch(`http://localhost:5000/api/courses/${urlParam}`);
                const response = await fetch(`https://server-courses-app.herokuapp.com/${urlParam}`); // Fetch from API hosted on Heroku
                const data = await response.json();
                const {
                    id,
                    title, 
                    description, 
                    estimatedTime, 
                    instructor, 
                    materialsNeeded,
                    userId
                } = data.course;

                // Set state to each destructured element
                setId(id);
                setTitle(title);
                setDescription(description);
                setEstimatedTime(estimatedTime);
                setInstructor(instructor);
                setMaterialsNeeded(materialsNeeded);
                setUserId(userId);

            // Catch any errors thrown from the fetch call
            } catch (error) {
                setError(error);
                // console.log(error);
                return error;
            }
        }
        fetchCourse();
    }, []);

    // LOG STATEMENTS
    // console.log(currentURL);
    // console.log(title);
    // console.log(description);
    // console.log(instructor);
    // console.log(materialsNeeded);
    // console.log(userId);
    // console.log(authUser);

    // Delete Course on click
    function onDelete() {
        // Store course props back into course
        const course = {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
        };

        // Call deleteCourse() from context
        context.data.deleteCourse(id, course, authEmail, authPass)
            .then( errors => { // chain then() to see if api returns status 403 and errors array
                if (errors.length) { // if errors are present
                    this.setState({ errors }); // update errors state to returned errors from api
                } else { // else if new course is successfully deleted from api, display log msg:
                    console.log(`${title} is successfully deleted!`);
                    props.history.push('/');
                }
            })
            .catch( error => { // handle errors (rejected promises) from server side
            console.log(error);
            })

        // LOG STATEMENTS
        // console.log(authUser);
        // console.log(authEmail);
        // console.log(authPass);
        // console.log(userId);
        // console.log(authUserId);
        // console.log(course);
    }

    // Mark up of returned course's details
    return (
        <main>
            {/* E.C. #1 */}
            {error ? (
                <Redirect to="/notfound" />
            ) : (
                <React.Fragment>
                    <div className="actions--bar">
                        <div className="wrap">
                            {/* Display Update and Delete buttons IF USER is authenticated */}
                            {authUser && authUser.userId === userId ? (
                                <React.Fragment>
                                    <NavLink exact to={`/courses/${id}/update`} className="button">Update Course</NavLink>
                                    <button className="button" onClick={onDelete}>Delete Course</button>
                                    <NavLink exact to="/" className="button button-secondary">Return to List</NavLink>
                                </React.Fragment>
                            ) : (
                                <NavLink exact to="/" className="button button-secondary">Return to List</NavLink>
                            )}
                        </div>
                    </div>
            
                    <div className="wrap">
                        <h2>Course Detail</h2>
                        <form>
                            <div className="main--flex">
                                <div>
                                    <h3 className="course--detail--title">Course</h3>
                                    <h4 className="course--name">{title}</h4>
                                    <p>By {instructor.firstName} {instructor.lastName}</p>
                                    <ReactMarkdown children={description} />
                                </div>

                                <div>
                                    <h3 className="course--detail--title">Estimated Time</h3>
                                    <p>{estimatedTime}</p>
                                    <h3 className="course--detail--title">Materials Needed</h3>
                                    <ul className="course--detail--list">
                                        <ReactMarkdown children={materialsNeeded} />
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </React.Fragment>
            )}
        </main>
    )
};




