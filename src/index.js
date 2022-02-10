import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from './Context'; // import Context Provider HOC
import App from './App';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // Wrap ENTIRE App with Provider Component
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
