import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Login from './login';
import Content from './content';
import ServerError from './serverError';

import { getIdpTicket, getToken, getCycleProgram } from './profile';
import { RES_TYPE, CREDS_SNACK, DEGREE_SNACK, SERVER_ERROR_TYPE } from './const';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sLogin: null,
            sPassword: null,
            sDegree: null,
            sCredsError: false,
            sDegreeError: false,
            sServerError: false,
            sSnackCreds: false,
            sSnackDegree: false,
            sServerErrorType: SERVER_ERROR_TYPE.INSIDE,
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleCloseSnackCreds = this.handleCloseSnackCreds.bind(this);
        this.handleCloseSnackDegree = this.handleCloseSnackDegree.bind(this);
        this.formStateObject = this.formStateObject.bind(this);
    }

    formStateObject(iLogin, iPassword, iDegree, iCredsError, iDegreeError, iServerError) {
        return {
            sLogin: iLogin,
            sPassword: iPassword,
            sDegree: iDegree,
            sCredsError: iCredsError,
            sDegreeError: iDegreeError,
            sSnackCreds: iCredsError,
            sSnackDegree: iDegreeError,
            sServerError: iServerError
        }
    }

    handleLogin(iLogin, iPassword, iDegree, iLoadButtonSetter) {
        this.handleLoginLoc(iLogin, iPassword, iDegree).then(response => {
            this.setState(response);

            if (response.sSnackCreds || response.sSnackDegree)
                iLoadButtonSetter(false);
        })
    }

    async handleLoginLoc(iLogin, iPassword, iDegree) {
        const login = iLogin.replace(/-/g, '');

        const idpTicket = await getIdpTicket(login, iPassword, iDegree);
        let result = null;

        switch (idpTicket.type) {
            case RES_TYPE.CREDS_ERROR:
                result = this.formStateObject(login, iPassword, iDegree, true, false, false);
                break;
            case RES_TYPE.SERVER_ERROR:
                result = this.formStateObject(null, null, null, false, false, true);
                break;
            case RES_TYPE.OK:
                const token = await getToken(idpTicket.data, iDegree);
                const cycleProgram = await getCycleProgram(token.data, iDegree);

                if (cycleProgram.type === RES_TYPE.SERVER_ERROR)
                    result = this.formStateObject(login, iPassword, iDegree, false, true, false);
                else if (cycleProgram.type === RES_TYPE.OK)
                    result = this.formStateObject(login, iPassword, iDegree, false, false, false);
                break;
        }

        return result;
    }

    handleCloseSnackCreds() {
        this.setState({ sSnackCreds: false });
    }
    handleCloseSnackDegree() {
        this.setState({ sSnackDegree: false });
    }

    render() {
        let content = <Login loginHandler={this.handleLogin} />;

        if (this.state.sServerError) {
            content = <ServerError errorType={this.state.sServerErrorType} />;
        } else if (this.state.sLogin && this.state.sPassword && !this.state.sDegreeError && !this.state.sCredsError)
            content = <Content login={this.state.sLogin} password={this.state.sPassword} degree={this.state.sDegree} />;

        return (<div>
            {content}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key='appCredsSnack'
                open={this.state.sSnackCreds ? true : false}
                onClose={this.handleCloseSnackCreds}>
                <MuiAlert elevation={6} variant="standard" severity="error">
                    {CREDS_SNACK}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key='appDegreeSnack'
                open={this.state.sSnackDegree ? true : false}
                onClose={this.handleCloseSnackDegree}>
                <MuiAlert elevation={6} variant="standard" severity="error">
                    {DEGREE_SNACK}
                </MuiAlert>
            </Snackbar>
        </div>)
    }
}

export default App;