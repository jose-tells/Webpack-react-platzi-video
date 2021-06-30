import React, { useState } from 'react'
// React-redux connect
import { connect } from 'react-redux';
// PropTypes
import PropTypes from 'prop-types'
// Classnames
import classNames from 'classnames';
//Styles
import '../assets/styles/components/Search.styl'
// Action
import { getItemFiltered } from '../actions';

const Search = (props) => {

    const { isHome } = props;

    const inputStyle = classNames('input', {
        isHome,
    });

    const [form, setValue] = useState('')

    const handleChange = event => {
        setValue(event.target.value)
    }

    const handleSubmit = event => {
        props.getItemFiltered(form)
        event.preventDefault()
    }

    return (
        <section className="main">
            <h2 className="main__title">¿Qué quieres ver hoy?</h2>
                    <form onSubmit={handleSubmit} >    
                        <input 
                            onChange={handleChange}
                            type="text" 
                            className={inputStyle} 
                            placeholder="Buscar..." 
                        />
                    </form>
        </section>
    );
};

Search.propTypes = {
    isHome: PropTypes.bool
}

const mapDispatchToProps = {
    getItemFiltered,
}

export default connect(null, mapDispatchToProps)(Search);