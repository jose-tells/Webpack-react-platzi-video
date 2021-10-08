import React from 'react';
import { Link } from 'react-router-dom';
// PropTypes
import PropTypes from 'prop-types';
// Classnames
import classNames from 'classnames';
// Reducers
import { connect } from 'react-redux';
// Gravatar
// import gravatar from '../utils/gravatar';
// Styles
import '../assets/styles/components/Header.styl';
// Images
import Logo from '../assets/static/logo-platzi-video-BW2.png';
import UserIcon from '../assets/static/user-icon.png';
// Actions
import { logoutRequest } from '../actions';

const Header = (props) => {

  const { user, isLogin, isRegister } = props;

  const hasUser = Object.keys(user).length > 0;

  const handleLogout = () => {
    document.cookie = 'id=';
    document.cookie = 'name=';
    document.cookie = 'email=';
    document.cookie = 'token=';
    props.logoutRequest({});
    window.location.href = '/login';
  };

  const headerClass = classNames('header', {
    isLogin,
    isRegister,
  });

  return (
    <header className={headerClass}>
      <Link to='/'>
        <img className='header__img' src={Logo} alt='Platzi Video' />
      </Link>
      <div className='header__menu'>
        <div className='header__menu--profile'>
          {
            hasUser ?
              <img src={user.email} alt={user.email} /> :
              <img src={UserIcon} alt='' />
          }
          <p>Perfil</p>
        </div>
        <ul>
          {
            hasUser ? (
              <li>
                {' '}
                <a href='/'>{user.name}</a>
                {' '}
              </li>
            ) :
              null
          }

          {
            hasUser ? (
              <li>
                <a href='#logout' onClick={handleLogout}>
                  Cerrar sesión
                </a>
              </li>
            ) :
              (
                <li>
                  <Link to='/login'>
                    Iniciar sesión
                  </Link>
                </li>
              )
          }
        </ul>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  logoutRequest,
};

Header.propTypes = {
  user: PropTypes.object,
  isLogin: PropTypes.bool,
  // isResgiter: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
