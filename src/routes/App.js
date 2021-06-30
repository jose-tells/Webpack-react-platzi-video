import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// Components
import Home from '../components/containers/Home'
import Login from '../components/containers/Login'
import NotFound from '../components/containers/NotFound';
import Player from '../components/containers/Player';
import Register from '../components/containers/Register';
import Layout from '../components/Layout';

const App = () => (
    <BrowserRouter>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} /> 
                <Route exact path="/register" component={Register} />
                <Route exact path="/player/:id" component={Player} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    </BrowserRouter>
);

export default App;