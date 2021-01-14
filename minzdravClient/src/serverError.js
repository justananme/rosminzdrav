import React from 'react';

import { SERVER_ERROR_TYPE, SERVER_ERROR_OUTSIDE, SERVER_ERROR_INSIDE } from './const'

class ServerError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const bgContent = this.props.errorType === SERVER_ERROR_TYPE.OUTSIDE
            ? SERVER_ERROR_OUTSIDE
            : SERVER_ERROR_INSIDE;


        return (
            <div className='serverErrorWrap'>
                {bgContent}
            </div>
        )
    }
}

export default ServerError;