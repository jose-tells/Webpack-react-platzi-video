import React from 'react';
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

const Home = ({ myList, trends, originals, find }) => {

  if (find.length > 0) {
    return (
      <>
        <Header />
        <Search isHome />
        <Categories title='Encontrados'>
          <Carousel>
            {find.map((item) => (
              <CarouselItem
                key={item.id}
                id={item.id}
                cover={item.cover}
                title={item.title}
                year={item.year}
                contentRating={item.contentRating}
                duration={item.duration}
              />
            ))}
            ;
          </Carousel>
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
            {myList.map((item) => (
              <CarouselItem
                key={item.id}
                id={item.id}
                cover={item.cover}
                title={item.title}
                year={item.year}
                contentRating={item.contentRating}
                duration={item.duration}
                isList
              />
            ))}
            ;
          </Carousel>
        </Categories>
      )}

      <Categories title='Tendencias'>
        <Carousel>
          {trends.map((item) => (
            <CarouselItem
              key={item.id}
              id={item.id}
              cover={item.cover}
              title={item.title}
              year={item.year}
              contentRating={item.contentRating}
              duration={item.duration}
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
              cover={item.cover}
              title={item.title}
              year={item.year}
              contentRating={item.contentRating}
              duration={item.duration}
            />
          ))}
          ;
        </Carousel>
      </Categories>
    </>
  );
};

Home.propTypes = {
  myList: PropTypes.array,
  trends: PropTypes.array,
  originals: PropTypes.array,
  find: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    find: state.find,
  };
};

export default connect(mapStateToProps, null)(Home);
