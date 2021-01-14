import React from 'react';

class Preloader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<div className='preloaderContainer'>
            <div className='preloaderText'>{this.props.text}</div>
            <div className='pulse'></div>
        </div>)
    }
}

export default Preloader;