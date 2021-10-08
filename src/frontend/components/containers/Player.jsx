import React, { useLayoutEffect } from 'react';
// Redux
import { connect } from 'react-redux';
// Styles
import '../../assets/styles/components/Player.styl';
// Action
import PropTypes from 'prop-types';
import { getVideoSource } from '../../actions';
import NotFound from './NotFound';
// Proptypes

const Player = (props) => {

  const { match, playing } = props;

  const { id } = match.params;

  const hasPlaying = Object.keys(playing).length > 0;

  useLayoutEffect(() => {
    props.getVideoSource(id);
  });

  return hasPlaying ? (
    <div className='Player'>
      <video controls autoPlay>
        <source src={playing.source} type='video/mp4' />
      </video>
      <div className='Player-back'>
        <button type='button' onClick={() => props.history.goBack()}>
          Regresar
        </button>
      </div>
    </div>
  ) : <NotFound />;
};

Player.propTypes = {
  id: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {
    playing: state.playing,
  };
};

const mapDispatchToProps = {
  getVideoSource,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
