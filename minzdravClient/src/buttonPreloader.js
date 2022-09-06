import React from 'react';
import styles from './buttonPreloader.module.css';

class ButonPreloader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<div className= {`${styles['la-ball-beat']} ${styles['la-sm']}`}>
            <div></div>
            <div></div>
            <div></div>
        </div>)
    }
}

export default ButonPreloader;