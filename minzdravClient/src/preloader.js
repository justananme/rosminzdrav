import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

const Text = styled.div`
    margin-bottom: 165px;
`;

function Preloader(props) {
    return (
        <Container>
            <Text>{props.text}</Text>
            <div className='pulse'></div>
        </Container>
    );
}

export default Preloader;