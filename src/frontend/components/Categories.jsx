import React from 'react';
// PropTypes
import PropTypes from 'prop-types';
// Styles
import '../assets/styles/components/Categories.styl';

const Categories = ({ children, title }) => (
  <div className='categories'>
    <h3 className='categories__title'>{ title }</h3>
    { children }
  </div>
);

Categories.propTypes = {
  title: PropTypes.string,
};

export default Categories;
