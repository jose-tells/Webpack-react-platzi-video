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
//React-redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../frontend/reducers/index';
import initialState from '../frontend/initialState';
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

const { env, port } = config;

const app = express();

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
        'script-src': ["'self'", "'sha256-NWxKQJgRj6SeFh+p06unga84IvUrcERYXv0iIQRWBe4='"],
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
const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <Layout>
        <StaticRouter location={req.url} context={{}}>
          {/* Review */}
          {renderRoutes(serverRoutes)}
        </StaticRouter>
      </Layout>
    </Provider>,
  );

  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get('*', renderApp);

app.listen(port, (err) => {
  err ? console.error(err) : console.log(`Server running at http://localhost:${port}`);
});
