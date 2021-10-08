/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import webpack from 'webpack';
// React, React-Redux and static router
import React from 'react';
import { renderToString } from 'react-dom/server';
// Helmet
import helmet from 'helmet';
//Static Router
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
// Cookie-parser
import cookieParser from 'cookie-parser';
// Express Session
// import session from 'express-session';
// Axios
import axios from 'axios';
// Boom
import boom from '@hapi/boom';
// Passport
import passport from 'passport';
//React-redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../frontend/reducers/index';
// Server Routes
import serverRoutes from '../frontend/routes/serverRoutes';
// Components
import Layout from '../frontend/components/Layout';
// GetManifest
import getManifest from './getManifest';
import config from './config';
// Webpack Hot Middleware
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config');

const app = express();
const { env, port } = config;

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// app.use(session());

// BASCIC STRATEGY
require('./utils/auth/strategies/basic');

if (env === 'development') {
  console.log('development config');
  const compiler = webpack(webpackConfig);
  const serverConfig = {
    port,
    hot: true,
  };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) {
      req.hashManifest = getManifest();
    };
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  //Route of our public folder
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'http://dummyimage.com'],
        'style-src-elem': ["'self'", 'https://fonts.googleapis.com'],
        'font-src': ['https://fonts.gstatic.com'],
        'media-src': ['*'],
      },
    }),
  );
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
};

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

  return (`
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href=${mainStyles} type="text/css"/>
          <title>Platzi Video</title>
      </head>
    <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src=${vendorBuild} type="text/javascript"></script>
        <script src=${mainBuild} type="text/javascript"></script>
    </body>
  </html>
  `);
};

// Function to convert to string our app
const renderApp = async (req, res) => {
  let initialState;
  try {
    const { id, name, email, token } = req.cookies;
    let moviesList = await axios({
      url: `${config.apiUrl}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });
    moviesList = moviesList.data.data;
    // Function to add a number ID to each the movie
    const moviesFix = () => {
      let i = 1;
      const moviesFix = moviesList.map((movie) => {
        return {
          id: i++,
          ...movie,
        };
      });
      return moviesFix;
    };

    let userMovies = await axios({
      url: `${config.apiUrl}/api/user-movies/?userId=${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });

    userMovies = userMovies.data.data;
    const myList = [];
    userMovies.forEach((movie) => {
      const foundMovies = moviesFix().find((movies) => movies._id === movie.movieId);
      myList.push(foundMovies);
    });

    initialState = {
      user: {
        id, name, email,
      },
      myList,
      trends: moviesFix().filter((movie) => movie.contentRating === 'PG' && movie._id),
      originals: moviesFix().filter((movie) => movie.contentRating === 'G' && movie._id),
      find: [],
    };
  } catch (error) {
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
      find: [],
    };
  }
  const store = createStore(reducer, initialState);
  const isLogged = Boolean(initialState.user.id);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <Layout>
        <StaticRouter location={req.url} context={{}}>
          {/* Review */}
          {renderRoutes(serverRoutes(isLogged))}
        </StaticRouter>
      </Layout>
    </Provider>,
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

// COOKIE LIFE-TIME
const TWO_HOURS_IN_MILISECONDS = 7200000;
const SIXTY_DAYS_IN_MILISECONDS = 5184000000;

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } = req.body;
  passport.authenticate('basic', async (error, data) => {
    try {
      if (error || !data) {
        return next(boom.unauthorized());
      }

      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }

        const { token, ...user } = data;

        res.cookie('token', token, {
          http: !config.dev,
          secure: !config.dev,
          maxAge: rememberMe ? SIXTY_DAYS_IN_MILISECONDS : TWO_HOURS_IN_MILISECONDS,
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: 'post',
      data: {
        'email': user.email,
        'name': user.name,
        'password': user.password,
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/user-movies', async (req, res, next) => {
  const { body: userMovie } = req;
  const { token } = req.cookies;

  try {
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies`,
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      data: userMovie,
    });

    if (status !== 201) {
      next(boom.badImplementation());
    };

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
  try {
    const { userMovieId } = req.params;
    const { token } = req.cookies;
    const { data, status } = await axios({
      url: `${config.apiUrl}/api/user-movies/${userMovieId}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'delete',
    });

    if (status !== 200) {
      next(boom.badImplementation());
    }

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

app.get('*', renderApp);

app.listen(port, (err) => {
  err ? console.error(err) : console.log(`Server running at http://localhost:${port}`);
});
