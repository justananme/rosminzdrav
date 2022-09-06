import React from 'react';
import styled from 'styled-components';
import { SERVER_ERROR_TYPE, SERVER_ERROR_OUTSIDE, SERVER_ERROR_INSIDE } from './const'

const Container = styled.div`
    margin: 0px 8px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    `;

function ServerError(props) {
    const content = props.errorType === SERVER_ERROR_TYPE.OUTSIDE
        ? SERVER_ERROR_OUTSIDE
        : SERVER_ERROR_INSIDE;

    return (
        <Container>
            {content}
        </Container>
    );
}

export default ServerError;