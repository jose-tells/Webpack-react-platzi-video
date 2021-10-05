import React from 'react';
import ReactDOM from 'react-dom';
//React-redux
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import reducer from './reducers/index';
//History
//Routes
import App from './routes/App';
// PreloadedState
const preloadedState = window.__PRELOADED_STATE__;

//delete
delete window.__PRELOADED_STATE__;

//BrowserHistory
const history = createBrowserHistory();
// React-redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, preloadedState, composeEnhancers());

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
