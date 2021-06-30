import React from 'react'
// Connect from react-redux
import { connect } from 'react-redux'
// Components
import Header from '../Header';
import Search from '../Search';
import Categories from '../Categories';
import Carousel from '../Carousel';
import CarouselItem from '../CarouselItem'
//Styles
import '../../assets/styles/App.styl';
// Proptypes validations
import PropTypes from 'prop-types'

const Home = ({ myList, trends, originals, find }) => {

        if (find.length > 0) {
        return (
            <>
                <Header />
                <Search isHome />
                <Categories title="Encontrados">
                    <Carousel>
                        {find.map(item => (
                            <CarouselItem
                                key={item.id}
                                {...item}
                            />
                        ))};
                    </Carousel>
                </Categories>
            </>
        )
    }

    return (
        <>
            <Header />
            <Search isHome />
            {myList.length > 0 && (
                <Categories title="Mi lista">
                    <Carousel>
                        {myList.map((item) => (
                            <CarouselItem
                                key={item.id}
                                {...item}
                                isList
                            />
                        ))};
                    </Carousel>
                </Categories>
            )}

            <Categories title="Tendencias">
                <Carousel>
                    {trends.map((item) => (
                        <CarouselItem
                            key={item.id} {...item}
                        />
                    ))}
                </Carousel>
            </Categories>
            )

            <Categories
                title="Originales de Platzi Video"
            >
                <Carousel>
                    {originals.map((item) => (
                        <CarouselItem
                            key={item.id} {...item}
                        />
                    ))};
                </Carousel>
            </Categories>
        </>
    )
};

Home.propTypes = {
    myList: PropTypes.array,
    trends: PropTypes.array,
    originals: PropTypes.array,
    find: PropTypes.array,
}

const mapStateToProps = state => {
    return {
        myList: state.myList,
        trends: state.trends,
        originals: state.originals,
        find: state.find,
    }
};

export default connect(mapStateToProps, null)(Home);