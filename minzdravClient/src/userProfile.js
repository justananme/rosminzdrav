import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 24px 5px 18px;
    background-color: #EF5466;

    @media screen and (max-width: 830px) {
        padding: 10px;
    }
    @media screen and (max-width: 530px) {
        flex-direction: column-reverse;
        align-items: flex-start;
    }
`;

const Container2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    position: relative;
    width: 100%;
    font-family: 'Rubik', sans-serif;
    font-weight: 400;
`;

const ScoresContainer = styled.div`
    min-width: 62px;
    min-height: 62px;
    display: flex;
    align-items: center;
    justify-items: center;

    @media screen and (max-width: 830px) {
        min-width: 58px;
        min-height: 58px;
    }
    @media screen and (max-width: 530px) {
        min-width: 56px;
        min-height: 56px;
    }
`;

const ScoresContainer2 = styled.div`
    width: 100%;
    width: -moz-available;
    width: -webkit-fill-available;
    width: fill-available;
    transform: translateY(-2px);
`;

const Caption = styled.div`
    font-size: 0.91rem;
    color: #ffffff;
    font-family: 'Arial', sans-serif;
`;

const Value = styled.div`
    font-size: 1.85rem;
    color: #ffffff;
`;

const BalanceContainer = styled.div`
    min-width: 62px;
    min-height: 62px;
    align-items: center;
    justify-items: center;
    margin-left: 11px;
    display: ${props => props.show ? 'none' : 'inherit'};


    @media screen and (max-width: 830px) {
        min-width: 58px;
        min-height: 58px;
    }
    @media screen and (max-width: 530px) {
        min-width: 56px;
        min-height: 56px;
}`;

const BalanceContainer2 = styled.div`
    width: 100%;
    width: -moz-available;
    width: -webkit-fill-available;
    width: fill-available;
    transform: translateY(-2px);
`;

const NameContainer = styled.div`
    min-width: 62px;
    min-height: 62px;
    display: flex;
    align-items: center;
    justify-items: center;
    right: 0;
    position: absolute;
`;

const NameContainer2 = styled.div`
    width: 100%;
    width: -moz-available;
    width: -webkit-fill-available;
    width: fill-available;
    transform: translateY(-2px);
`;

const NameContainer3 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const TipVip = styled.div`
    background-color: #ffffff;
    color: #ea3550;
    border-radius: 20px;
    padding: 0.5px 10px;
    width: fit-content;
    display: ${props => props.show ? 'block' : 'none'};
`;

function Profile(props) {
    const usernameStyle = props.premium ? { display: 'none' } : { visibility: 'hidden' };

    return (
        <Container>
            <Container2>
                <ScoresContainer>
                    <ScoresContainer2>
                        <Value>{props.zets}</Value>
                        <Caption>Баллы</Caption>
                    </ScoresContainer2>
                </ScoresContainer>
                <BalanceContainer show={props.premium}>
                    <BalanceContainer2>
                        <Value>{props.queriesLeft}</Value>
                        <Caption><span>Баланс</span></Caption>
                    </BalanceContainer2>
                </BalanceContainer>
                <NameContainer>
                    <NameContainer2>
                        <Value style={usernameStyle}>0</Value>
                        <Caption>
                            <NameContainer3>
                                <TipVip show={props.premium}>
                                    PREMIUM
                                </TipVip>
                                <div style={{ display: props.premium ? 'block' : 'none', height: '4px' }}></div>
                                <div>{props.name}</div>
                            </NameContainer3>
                        </Caption>
                    </NameContainer2>
                </NameContainer>
            </Container2>
        </Container>
    );
}

export default Profile;