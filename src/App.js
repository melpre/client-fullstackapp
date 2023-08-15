////////// NOTES //////////


////////// TO-DO //////////
// 1. Complete re-style of static files (research potential CSS tools)


/******************************************
Full Stack App using React and a REST API
by Melissa Preece

Notable features:
// 1. Display user friendly messages
      // See files: NotFound.js, Forbidden.js, and UnhandledError.js
      // See file App.js, lines 77-80
      // See files: CourseDetail.js lines 114-115 and UpdateCourse.js lines 66-75
      // See file App.js, line 80
      // See file UpdateCourse.js lines 57-59

// 2. Persist user credentials
      // See file Context.js

// 3. Redirecting the user after successfully signing in
      // See file PrivateRoute.js
******************************************/

// Import React libraries and stylesheets
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './styles/reset.css'; // This has to be imported first BEFORE global.css
import './styles/global.css';

// Import components
import Header from './components/Header.js';
import Courses from './components/Courses.js';
import CourseDetail from './components/CourseDetail.js';
import CreateCourse from './components/CreateCourse.js';
import UpdateCourse from './components/UpdateCourse.js';
import UserSignIn from './components/UserSignIn.js';
import UserSignUp from './components/UserSignUp.js';
import UserSignOut from './components/UserSignOut.js';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import PrivateRoute from './PrivateRoute';

// Import higher order function 'withContext' to subscribe a component passed to it all actions and context changes
import withContext from './Context'; 

// Connect Components to context:
const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut); 
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
const CoursesWithContext = withContext(Courses);

export default function App() {
  return (
    <BrowserRouter>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        
        {/* E.C. #1 */}
        <Route path="/notfound" component={NotFound} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path ="/error" component={UnhandledError} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
};





