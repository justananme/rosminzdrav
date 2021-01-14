import React from 'react';

class ButonPreloader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<div className="la-ball-beat la-sm">
        <div></div>
        <div></div>
        <div></div>
    </div>)
    }
}

export default ButonPreloader;