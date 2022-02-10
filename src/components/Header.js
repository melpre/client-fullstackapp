/* STATELESS FUNCTION COMPONENT */

// Import React libraries
import React from 'react';
import { NavLink } from 'react-router-dom';

// Declare function to render Header elements
export default function Header(props) {
    // Extract context (now that Header is subscribed to Context) from props
    const { context } = props;
    // Store authenticated user data in new var 'authUser'
    const authUser = context.authenticatedUser;
    // Mark up of Header
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><NavLink exact to="/">Courses</NavLink></h1>
                <nav>
                    {authUser ? (
                        <React.Fragment>
                            <ul className="header--signedin">
                                <li>Welcome, {authUser.firstName} {authUser.lastName}!</li>
                                <li><NavLink to="/signout">Sign Out</NavLink></li>
                            </ul>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <ul className="header--signedout">
                                <li><NavLink to="/signup">Sign Up</NavLink></li>
                                <li><NavLink to="/signin">Sign In</NavLink></li>
                            </ul>
                        </React.Fragment>
                    )}
                </nav>  
            </div>
        </header> 
    );
}


