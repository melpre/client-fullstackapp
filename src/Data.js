/* DATA (HELPER) CLASS: */

import config from './config';

export default class Data {
  // api() method will make GET and POST requests to /users & GET, POST, PUT and DELETE requests to /courses endpoint of api
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    // Declare var 'url' and assign it to config url + path name
    const url = config.apiBaseUrl + path;
  
    // Declare options object that sends request with the HTTP method, the request headers and a stringified body (if provided)
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    // Check if authorization is required
    if (requiresAuth) { //requests to protected routes in api requiresAuth to be true
      // The btoa() method creates a base-64 encoded ASCII string from a "string" of data. 
      // We'll use btoa() to encode the user ID (in this case emailAddress) and password credentials passed to the api() 
      // method. The credentials will be passed as an object containing emailAddress and password 
      // properties. Make sure to use : colon between each property
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      // Add authorization property to headers object and set it to var encodedCredentials
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // getUser() makes GET request to /users endpoint, and returns JSON object containing user credentials.
  // To authenticate user using credentials, set requiresAuth param to 'true' and credentials to
  // properties 'emailAddress' and 'password' from credentials object.
  async getUser(emailAddress, password) {
    const response = await this.api('/users', 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  // createUser() makes POST request, sending new user data to the /users endpoint.
  async createUser(user) {
    const response = await this.api('/users', 'POST', user, false);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // createCourse() makes POST request, sending new course data to the /courses endpoint
  async createCourse(course, emailAddress, password) {
    const response = await this.api('/courses', 'POST', course, true, { emailAddress, password });
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // updateCourse() makes PUT request, sending updated course data to the /courses/:id endpoint
  async updateCourse(id, course, emailAddress, password) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, { emailAddress, password });
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) { // check to see if response status is 400 (Bad Request)
      return response.json().then(data => {
        console.log(data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // deleteCourse() makes DELETE request to the /courses endpoint
  async deleteCourse(id, course, emailAddress, password) {
    // Delete Course data including header options
    const response = await this.api(`/courses/${id}`, 'DELETE', course, true, { emailAddress, password} );
    if (response.status === 204) {
      return [];
    } else if (response.status === 403) {
      return response.json().then(data => {
        console.log(data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

}



