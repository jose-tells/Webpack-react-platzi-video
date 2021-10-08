import React from 'react';
import { Link } from 'react-router-dom';
import Proptypes from 'prop-types';
// Styles
import '../assets/styles/components/CarouselItem.styl';
// Images
import { connect } from 'react-redux';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';
// Connect
import { favoriteUserMovies, deleteUserMovies } from '../actions';

const CarouselItem = (props) => {

  const { id, movieId, userId, cover, title, year, contentRating, duration, isList, selectMovie, movieExists } = props;

  const handleSetFavorite = () => {
    selectMovie(movieId);
    if (!movieExists) {
      props.favoriteUserMovies(userId, { id, movieId, cover, title, year, contentRating, duration });
    };
  };

  const handleDeleteFavorite = () => {
    props.deleteUserMovies(movieId, id);
  };

  return (
    <div className='carousel-item'>
      <img className='carousel-item__img' src={cover} alt='' />
      <div className='carousel-item__details'>
        <div>
          <Link to={`/player/${id}`}>
            <img
              className='carousel-item__details--img'
              src={playIcon}
              alt='Play Icon'
            />
          </Link>
          {isList ? (
            <img
              className='carousel-item__details--img'
              src={removeIcon}
              alt='Remove Icon'
              onClick={handleDeleteFavorite}
            />
          ) : (
            <img
              className='carousel-item__details--img'
              src={plusIcon}
              alt='Plus Icon'
              onClick={handleSetFavorite}
            />
          )}

        </div>
        <p className='carousel-item__details--title'>{title}</p>
        <p className='carousel-item__details--subtitle'>{`${year} ${contentRating} ${duration}`}</p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  id: Proptypes.number,
  cover: Proptypes.string,
  title: Proptypes.string,
  year: Proptypes.number,
  contentRating: Proptypes.string,
  duration: Proptypes.number,
  isList: Proptypes.bool,
};

const mapDispatchToProps = {
  favoriteUserMovies,
  deleteUserMovies,
};

export default connect(null, mapDispatchToProps)(CarouselItem);

