import Home from '../components/containers/Home';
import Login from '../components/containers/Login';
import NotFound from '../components/containers/NotFound';
import Player from '../components/containers/Player';
import Register from '../components/containers/Register';

const serverRoutes = (isLogged) => {
  return [
    {
      exact: true,
      path: '/',
      component: isLogged ? Home : Login,
    },
    {
      exact: true,
      path: '/login',
      component: Login,
    },
    {
      name: 'NotFound',
      component: NotFound,
    },
    {
      exact: true,
      path: '/player/:id',
      component: isLogged ? Player : Login,
    },
    {
      exact: true,
      path: '/',
      component: Register,
    },
  ];
};

export default serverRoutes;
