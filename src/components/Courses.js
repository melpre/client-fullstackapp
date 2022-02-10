/* STATEFUL FUNCTION COMPONENT */

// Import React and useState, useEffect hooks
import React, { useState, useEffect } from 'react';
import { NavLink, Redirect } from 'react-router-dom';

// Declare stateful functional component to retrieve list of courses' titles from API data
export default function Courses() {
    // Initialize state with useState() hook and store initial array for courses and errors
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(''); // define 'error' state
  
    // Call useEffect() to fetch API data: courses list
    useEffect(() => {
        async function fetchCourses() {
            // Note: try block tests if there's an exception thrown, if none, set state to fetched course data 
            // catch catches and handles specified error and response
            try {
                // const response = await fetch('http://localhost:5000/api/courses') //Pass the URL to the fetch API
                const response = await fetch('http://localhost:8000/api/courses') // new port 8000
                const courses = await response.json(); //Parse response to JSON
                setCourses(courses.courses) //Update state to data fetched from API
                    
            // Catch any errors thrown from the fetch call
            } catch (error) {
                setError(error);
                console.log(error.message); // LOG STATEMENT
                return error;
            }
        }
        fetchCourses(); // call fetchCourses()
    }, []);

    // LOG STATEMENTS
    // console.log(courses);
  
    // Mark up of list of courses
    // Note: In the NavLink "to" attribute, assign object value (course.id) interpolated with a template literal
    // to dynamically render a link to each course in the list
    return (
        <div className="wrap main--grid">
            {error ? (
                <Redirect to="/error" />
            ) : (
                <React.Fragment>
                    {courses.map((course) =>
                    <NavLink to={`/courses/${course.id}`} key={course.id} className="course--module course--link">
                        <h2 className="course--label">Course</h2>
                        <h3 className="course--title">{course.title}</h3>
                    </NavLink>
                    )}

                <NavLink to="courses/create" className="course--module course--add--module">
                    <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                        </svg>
                        New Course
                    </span>
                </NavLink>
            </React.Fragment>
            )}
        </div>
    );
  }
  


  
  