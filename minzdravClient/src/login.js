import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';

import ButonPreloader from './buttonPreloader';
import DialogInstruction from './dialogInstruction';
import MessageBar from './messageBar';
import mPicture from './resources/bg.jpg';
import sPicture from './resources/bg2.jpg';

import { PACKAGE, EMPTY_LOGIN_SNACK, EMPTY_PASSWORD_SNACK, UNSET_DEGREE_SNACK, LOGIN_INPUT } from './const';


const useMuStyles = makeStyles(theme => ({
    form: {
        wclassNameth: '100%', // Fix IE 11 issue
        marginTop: '8px',
        marginBottom: '4px',
        width: '90%',
        '@media (max-width: 830px)': {
            '& > div:first-child': {
                marginTop: '0px',
            },
        }
    },
    formControl: {
        marginTop: '16px',
        marginBottom: '8px',
    },
    button: {
        float: 'right',
        width: 'auto',
        backgroundColor: '#ffffff8f',
        '&:hover': {
            backgroundColor: '#ffffff8f',
        },
        border: '1px solid rgb(115 115 115 / 50%)',
        color: '#3a3a3a',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '600',
        lineHeight: '1.4',
        padding: '8px 46px',
        minHeight: '40px',
        minWidth: '146px',
    }
}));

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F9F9F9;

    @media (max-width: 830px) {
        min-height: 320px;
        overflow: hidden;
    }
`;

const Container2 = styled.div`
    background-color: #F4F3F1;
    width: 900px;
    height: 500px;
    display: flex;
    flex-direction: row;
    -webkit-box-shadow: 0px 20px 27px -9px rgba(173, 173, 173, 1);
    -moz-box-shadow: 0px 20px 27px -9px rgba(173, 173, 173, 1);
    box-shadow: 0px 20px 27px -9px rgba(173, 173, 173, 1);

    @media (max-width: 830px) {
        width: 100%;
        height: 100%;
        box-shadow: 0 0 black;
    }
    @media (max-width: 500px) {
        flex-direction: column;
        justify-content: space-around;
    }
`;

const ContentLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 2;
    flex-basis: 0;
    position: relative;

    @media (max-width: 830px) {
        flex-grow: 1.25;
        align-items: center;
        justify-content: center;
    }
    @media (max-width: 500px) {
        flex-grow: initial;
    }
`;

const ContentRight = styled.div`
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    align-items: center;
    border-left: 1px solid #d4d4d4;

    @media (max-width: 500px) {
        flex-grow: initial;
    }
`;

const Title = styled.div`
    position: absolute;
    padding-bottom: 312px;
    padding-right: 100px;
    font-size: 34px;
    font-family: monospace;
    font-weight: 500;
    text-align: center;
    text-decoration: underline;
    width: 100%;

    @media (max-width: 830px) {
        font-size: 23px;
        margin: 0px;
        padding: 0px;
        padding-bottom: 130px;
    }
`;

const Picture = styled.div`
    width: 345px;
    height: 345px;
    min-width: 345px;
    min-height: 345px;
    margin-right: 30px;
    background-image: url(${mPicture});
    border-radius: 4px;
    margin-top: auto;

    @media (max-width: 830px) {
        width: 200px;
        height: 200px;
        min-width: 200px;
        min-height: 200px;
        background-image: url(${sPicture});
    }
    @media (max-width: 500px) {
        margin: 0px;
    }
`;

const AboutButton = styled.div`
    margin-top: auto;
    margin-right: auto;
    margin-bottom: 7px;
    font-size: 12px;
    color: #999999;
    text-decoration: underline;
    padding-left: 10px;
    &:hover {
        cursor: pointer;
    }

    @media (max-width: 500px) {
        display: none;
    }
`;

const AboutButtonSmall = styled.div`
    display: none;

    @media (max-width: 500px) {
        display: flex;
        align-items: flex-end;
        font-size: 11px;
        margin-left: 1px;
        color: #999999;
        text-decoration: underline;
    }
`;

const FormContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const ButtonsContainer = styled.div`
    margin-top: 16px;

    @media (max-width: 830px) {
        display: flex;
        justify-content: flex-end;
    }
    @media (max-width: 500px) {
        justify-content: space-between;
    }
`;


function Login(props) {
    const muStyles = useMuStyles();

    const [sCredentials, setCredentials] = useState({ login: '', password: '', degree: '' });
    const [sSnackBars, setSnackBars] = useState({
        noLogin: false,
        noPassword: false,
        noDegree: false,
    });

    const [sLoginLoadDisp, setLoginLoadDisp] = useState(false);
    const [inputFocus, setInputFocus] = useState(LOGIN_INPUT.LOGIN);
    const [sInstructionDialogOpen, setInstructionDialog] = useState(false);

    function openInstructionHandler() {
        setInstructionDialog(true);
    }
    function closeInstructionHandler() {
        setInstructionDialog(false);
    }

    function onFormFieldChange(e) {
        let updatedCredentials = { ...sCredentials };
        switch (e.name) {
            case 'login':
                updatedCredentials.login = e.value;
                setInputFocus(LOGIN_INPUT.LOGIN);
                break;
            case 'password':
                updatedCredentials.password = e.value;
                setInputFocus(LOGIN_INPUT.PASSWORD);
                break;
            case 'degree':
                updatedCredentials.degree = e.value;
                setInputFocus(LOGIN_INPUT.NONE);
                break;
        }

        setCredentials(updatedCredentials);
    }

    function handleCloseMessageBar(e) {
        let updatedSnack = { ...sSnackBars };
        if (e.target.id !== 'submitLoginFormButton') {
            updatedSnack.noLogin = false;
            updatedSnack.noPassword = false;
            updatedSnack.noDegree = false;
        }

        setSnackBars(updatedSnack);
    }

    function submitFormHandler(e) {
        e.stopPropagation();

        let isFetchUser = false;
        let updatedSnacks = { ...sSnackBars };

        if (sCredentials.login === '')
            updatedSnacks.noLogin = true;
        else if (sCredentials.password === '') {
            updatedSnacks.noPassword = true;
        }
        else if (sCredentials.degree === '')
            updatedSnacks.noDegree = true;

        setSnackBars(updatedSnacks);

        if (sCredentials.login.length > 0 && sCredentials.password.length > 0 && sCredentials.degree.length > 0)
            isFetchUser = true;

        setLoginLoadDisp(isFetchUser);

        if (isFetchUser)
            props.loginHandler(sCredentials.login, sCredentials.password, sCredentials.degree, setLoginLoadDisp)
    }

    function enterHandler(e) {
        if (e.key === 'Enter')
            submitFormHandler(e);
    }

    function snilsFormater(props) {
        const { inputRef, onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={inputRef}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                isNumericString
                format="###-###-###-##"
            />
        );
    }

    const loginButtonContent = sLoginLoadDisp ? <ButonPreloader /> : <span>ВХОД</span>;

    return (
        <Container>
            <Container2>
                <ContentLeft>
                    <Title>
                        Прохождение тестов НМО
                    </Title>
                    <Picture />
                    <AboutButton onClick={openInstructionHandler}>
                        О сервисе
                    </AboutButton>
                </ContentLeft>
                <ContentRight>
                    <FormContainer>
                        <form className={muStyles.form} noValidate>
                            <TextField
                                value={sCredentials.login}
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='snils'
                                label='СНИЛС'
                                autoComplete='tel'
                                autoFocus={inputFocus === LOGIN_INPUT.LOGIN}
                                InputProps={{
                                    inputComponent: snilsFormater,
                                }}
                                onChange={(e) => onFormFieldChange({ name: 'login', value: e.target.value })}
                                onKeyPress={enterHandler}
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Пароль'
                                type='password'
                                autoComplete='current-password'
                                autoFocus={inputFocus === LOGIN_INPUT.PASSWORD}
                                onChange={(e) => onFormFieldChange({ name: 'password', value: e.target.value })}
                                onKeyPress={enterHandler}
                            />
                            <FormControl variant="outlined" className={muStyles.formControl} fullWidth>
                                <InputLabel>Образование</InputLabel>
                                <Select
                                    labelId="educationSelectLabel"
                                    value={sCredentials.degree}
                                    onChange={(e) => onFormFieldChange({ name: 'degree', value: e.target.value })}
                                    label="Образование">
                                    <MenuItem value={PACKAGE.DEGREE.HIGHER_EDUCATION}>Высшее</MenuItem>
                                    <MenuItem value={PACKAGE.DEGREE.PROFESSIONAL_EDUCATION}>Среднее профессиональное</MenuItem>
                                </Select>
                            </FormControl>
                            <ButtonsContainer>
                                <AboutButtonSmall onClick={openInstructionHandler}>
                                    О сервисе
                                </AboutButtonSmall>
                                <Button
                                    id='submitLoginFormButton'
                                    className={muStyles.button}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={submitFormHandler}>
                                    {loginButtonContent}
                                </Button>
                            </ButtonsContainer>
                        </form>
                    </FormContainer>
                </ContentRight>
            </Container2>
            <DialogInstruction open={sInstructionDialogOpen} closeInstructionHandler={closeInstructionHandler} />
            <MessageBar
                severity='error'
                isOpen={sSnackBars.noLogin}
                content={EMPTY_LOGIN_SNACK}
                closeHandler={handleCloseMessageBar}
            />
            <MessageBar
                severity='error'
                isOpen={sSnackBars.noPassword}
                content={EMPTY_PASSWORD_SNACK}
                closeHandler={handleCloseMessageBar}
            />
            <MessageBar
                severity='error'
                isOpen={sSnackBars.noDegree}
                content={UNSET_DEGREE_SNACK}
                closeHandler={handleCloseMessageBar}
            />
        </Container>
    )
}

export default Login;