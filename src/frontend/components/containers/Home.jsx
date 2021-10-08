import React, { useState } from 'react';
// Connect from react-redux
import { connect } from 'react-redux';
// Proptypes validations
import PropTypes from 'prop-types';
// Components
import Header from '../Header';
import Search from '../Search';
import Categories from '../Categories';
import Carousel from '../Carousel';
import CarouselItem from '../CarouselItem';
//Styles
import '../../assets/styles/App.styl';

const Home = ({ user, myList, trends, originals, find }) => {

  const [movieIdSelected, selectMovie] = useState(0);

  const movieExists = myList.find((movie) => movie._id === movieIdSelected || movie.movieId === movieIdSelected);

  if (find.length > 0) {
    return (
      <>
        <Header />
        <Search isHome />
        <Categories title='Encontrados'>
          <Carousel>
            {find.map((item) => (
              <CarouselItem
                key={Number(item.id)}
                id={item.id}
                movieId={item._id}
                userId={user.id}
                cover={item.cover}
                title={item.title}
                year={item.year}
                contentRating={item.contentRating}
                duration={item.duration}
              />
            ))}
            ;
          </Carousel>
          <h2>{}</h2>
        </Categories>
      </>
    );
  }

  return (
    <>
      <Header />
      <Search isHome />
      {myList.length > 0 && (
        <Categories title='Mi lista'>
          <Carousel>
            {myList.map((item) => {
              const itemId = item._id ? item._id : item.movieId;
              return (
                <CarouselItem
                  key={Number(item.id)}
                  id={item.id}
                  movieId={itemId}
                  userId={user.id}
                  cover={item.cover}
                  title={item.title}
                  year={item.year}
                  contentRating={item.contentRating}
                  duration={item.duration}
                  isList
                  movieExists={movieExists}
                />
              );
            })}
            ;
          </Carousel>
        </Categories>
      )}

      <Categories title='Tendencias'>
        <Carousel>
          {trends.map((item) => (
            <CarouselItem
              key={Number(item.id)}
              id={item.id}
              movieId={item._id}
              userId={user.id}
              cover={item.cover}
              title={item.title}
              year={item.year}
              contentRating={item.contentRating}
              duration={item.duration}
              selectMovie={selectMovie}
              movieExists={movieExists}
            />
          ))}
        </Carousel>
      </Categories>
      )

      <Categories
        title='Originales de Platzi Video'
      >
        <Carousel>
          {originals.map((item) => (
            <CarouselItem
              key={item.id}
              id={item.id}
              movieId={item._id}
              userId={user.id}
              cover={item.cover}
              title={item.title}
              year={item.year}
              contentRating={item.contentRating}
              duration={item.duration}
              selectMovie={selectMovie}
              movieExists={movieExists}
            />
          ))}
          ;
        </Carousel>
      </Categories>
    </>
  );
};

Home.propTypes = {
  user: PropTypes.object,
  myList: PropTypes.array,
  trends: PropTypes.array,
  originals: PropTypes.array,
  find: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    find: state.find,
  };
};

export default connect(mapStateToProps, null)(Home);
