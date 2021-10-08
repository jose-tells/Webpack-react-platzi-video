import React from 'react';
import ReactDOM from 'react-dom';
//React-redux
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
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
const store = createStore(reducer, preloadedState, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App isLogged={Boolean(preloadedState.user.id)} />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
