import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NumberFormat from 'react-number-format';

import ButonPreloader from './buttonPreloader';
import DialogInstruction from './dialogInstruction';

import { DEGREE, EMPTY_LOGIN_SNACK, EMPTY_PASSWORD_SNACK, UNSET_DEGREE_SNACK, LOGIN_INPUT } from './const';

const styles = {
    button: {
        float: 'right',
        width: 'auto',
        backgroundColor: '#ffffff8f',
        '&:hover': {
            backgroundColor: '#ffffff8f',
        },
        border: '1px solid rgb(115 115 115 / 50%)',
        color: '#3a3a3a',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        lineHeight: '1.4',
        padding: '8px 36px'
    }
}

const useStyles = makeStyles(theme => ({
    form: {
        wclassNameth: '100%', // Fix IE 11 issue.
        marginTop: '8px',
        marginBottom: '4px',
    },
    formControl: {
        marginTop: '16px',
        marginBottom: '8px',
    },
    buttonProgress: {
        color: 'white',
    },
}));

function Login(props) {
    const { classes } = props;

    const classes2 = useStyles();

    const [sLogin, setLogin] = useState('');
    const [sPassword, setPassword] = useState('');
    const [sDegree, setDegree] = useState('');
    const [sSnackLogin, setSnackLogin] = useState(false);
    const [sSnackPassword, setSnackPassword] = useState(false);
    const [sSnackDegree, setSnackDegree] = useState(false);
    const [sLoginLoadDisp, setLoginLoadDisp] = useState(false);
    const [inputFocus, setInputFocus] = useState(LOGIN_INPUT.LOGIN);
    const [sInstructionDialogOpen, setInstructionDialog] = useState(false);

    function openInstructionHandler() {
        setInstructionDialog(true);
    }
    function closeInstructionHandler() {
        setInstructionDialog(false);
    }
    function onLoginChange(event) {
        setInputFocus(LOGIN_INPUT.LOGIN);
        setLogin(event.target.value);
    }
    function onPasswordChange(event) {
        setInputFocus(LOGIN_INPUT.PASSWORD);
        setPassword(event.target.value);
    }
    function onDegreeChange(event) {
        setInputFocus(LOGIN_INPUT.NONE);
        setDegree(event.target.value)
    }

    function handleCloseSnackEmptyLogin() {
        setSnackLogin(false);
    }
    function handleCloseSnackEmptyPassword() {
        setSnackPassword(false);
    }
    function handleCloseSnackUnsetDegree() {
        setSnackDegree(false);
    }

    function submitHandler(e) {
        if (sLogin === '')
            setSnackLogin(true);
        else if (sPassword === '') {
            setSnackPassword(true);
        }
        else if (sDegree === '')
            setSnackDegree(true);

        if (sLogin.length > 0 && sPassword.length > 0 && sDegree.length > 0) {
            setLoginLoadDisp(true);
            props.loginHandler(sLogin, sPassword, sDegree, setLoginLoadDisp)
        }
    }
    function enterHandler(e) {
        if (e.key === 'Enter')
            submitHandler(e);
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

    const button = sLoginLoadDisp ? <ButonPreloader /> :
        <div className='loginButtonText'>
            <span>ВХОД</span>
        </div>

    return (
        <div className='layout'>
            <div className='content'>
                <div className='contentLeft'>
                    <div className='introdescription'>Прохождение тестов НМО</div>
                    <div className='intropicture' ></div>
                    <div className='introcontactMedium'>
                        <span onClick={openInstructionHandler} style={{ padding: '10px' }}>О сервисе</span>
                    </div>
                </div>
                <div className='contentRight'>
                    <div className='loginForm'>
                        <form className={classes2.form} noValidate>
                            <TextField
                                value={sLogin}
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='snils'
                                name='snils'
                                label='СНИЛС'
                                autoComplete='tel'
                                autoFocus={inputFocus === LOGIN_INPUT.LOGIN ? true : false}
                                InputProps={{
                                    inputComponent: snilsFormater,
                                }}
                                onChange={onLoginChange}
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
                                id='password'
                                autoComplete='current-password'
                                autoFocus={inputFocus === LOGIN_INPUT.PASSWORD ? true : false}
                                onChange={onPasswordChange}
                                onKeyPress={enterHandler}
                            />
                            <FormControl variant="outlined" className={classes2.formControl} fullWidth>
                                <InputLabel>Образование</InputLabel>
                                <Select
                                    labelId="educationSelectLabel"
                                    id="educationSelect"
                                    value={sDegree}
                                    onChange={onDegreeChange}
                                    label="Образование">
                                    <MenuItem value={DEGREE.HIGHER_EDUCATION}>Высшее</MenuItem>
                                    <MenuItem value={DEGREE.PROFESSIONAL_EDUCATION}>Среднее профессиональное</MenuItem>
                                </Select>
                            </FormControl>
                            <div className='loginButtonCircularContainer'>
                                <div className='introcontactSmall'>
                                    <span onClick={openInstructionHandler}>О сервисе</span>
                                </div>
                                <Button
                                    className={clsx(classes.button)}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={submitHandler}>
                                    <div className='loginButtonContent'>
                                        {button}
                                    </div>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <DialogInstruction open={sInstructionDialogOpen} closeInstructionHandler={closeInstructionHandler} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key='snackLoginEmptyLogin'
                open={sSnackLogin ? true : false}
                onClose={handleCloseSnackEmptyLogin}>
                <MuiAlert elevation={6} variant="standard" severity="error">
                    {EMPTY_LOGIN_SNACK}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key='snackLoginEmptyPassword'
                open={sSnackPassword ? true : false}
                onClose={handleCloseSnackEmptyPassword}>
                <MuiAlert elevation={6} variant="standard" severity="error">
                    {EMPTY_PASSWORD_SNACK}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key='snackLoginUnsetDegree'
                open={sSnackDegree ? true : false}
                onClose={handleCloseSnackUnsetDegree}>
                <MuiAlert elevation={6} variant="standard" severity="error">
                    {UNSET_DEGREE_SNACK}
                </MuiAlert>
            </Snackbar>
        </div>
    )
}

export default withStyles(styles)(Login);