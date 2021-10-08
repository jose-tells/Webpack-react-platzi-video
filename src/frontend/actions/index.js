import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const getItemFiltered = (payload) => ({
  type: 'GET_ITEM_FILTERED',
  payload,
});

export const registeUser = (payload, redirectURL) => {
  return (dispatch) => {
    axios.post('/auth/sign-up', payload)
      .then((data) => dispatch(registerRequest(data)))
      .then(() => {
        window.location.href = redirectURL;
      })
      .catch((error) => dispatch(console.log(error)));
  };
};

export const loginUser = ({ email, password }, redirectURL) => {
  return (dispatch) => {
    axios({
      url: '/auth/sign-in',
      method: 'post',
      auth: {
        password,
        username: email,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.user.email}`;
        document.cookie = `name=${data.user.name}`;
        document.cookie = `id=${data.user.id}`;
        dispatch(loginRequest(data.user));
      })
      .then(() => {
        window.location.href = redirectURL;
      })
      .catch((error) => console.log(error));
  };
};

export const favoriteUserMovies = (userId, movie) => {
  return (dispatch) => {
    const data = {
      userId,
      movieId: movie.movieId,
    };
    axios({
      url: '/user-movies',
      method: 'post',
      data,
    })
      .then(() => dispatch(setFavorite(movie)))
      .catch((error) => console.log(error));
  };
};

export const deleteUserMovies = (userMovieId, movieId) => {
  return (dispatch) => {
    axios({
      url: `/user-movies/${userMovieId}`,
      method: 'delete',
    })
      .then(() => dispatch(deleteFavorite(movieId)))
      .catch((error) => console.log(error));
  };
};
