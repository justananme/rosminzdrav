import React, { useState } from "react";
import MessageBar from './messageBar';
import Login from './login';
import Content from './content';
import ServerError from './serverError';

import { queries } from './profile';
import { PACKAGE, CREDS_SNACK, DEGREE_SNACK, SERVER_ERROR_TYPE } from './const';

function formStateObject(iLogin, iPassword, iDegree, iLoginPasswordError, iDegreeError, iServerError) {
        const updatedState = {
            credentials: { login: iLogin, password: iPassword, degree: iDegree },
            errors: { loginPassword: iLoginPasswordError, degree: iDegreeError, server: iServerError },
            popupMessages: { loginPassword: iLoginPasswordError, degree: iDegreeError },
        }

        return updatedState;
    }

function App() {
    const [sCredentials, setCredentials] = useState({ login: '', password: '', degree: '' });
    const [sErrors, setErrors] = useState({ loginPassword: false, degree: false, server: false, });
    const [sPopupMessages, setPopupMessages] = useState({ loginPassword: false, degree: false });

    async function handleLogin(iLogin, iPassword, iDegree, iLoadButtonSetter) {
        let updatedState = formStateObject(iLogin, iPassword, iDegree);

        const login = iLogin.replace(/-/g, '');
        const idpTicket = await queries.fetchIdpTicket(login, iPassword, iDegree);

        switch (idpTicket.type) {
            case PACKAGE.RESPONSE_TYPE.CREDENTIALS_ERROR:
                updatedState = formStateObject(login, iPassword, iDegree, true, false, false);
                break;
            case PACKAGE.RESPONSE_TYPE.SERVER_ERROR:
                updatedState = formStateObject(null, null, null, false, false, true);
                break;
            case PACKAGE.RESPONSE_TYPE.OK:
                const token = await queries.fetchToken(idpTicket.data, iDegree);
                const cycleProgram = await queries.fetchCycleProgram(token.data, iDegree);

                if (cycleProgram.type === PACKAGE.RESPONSE_TYPE.SERVER_ERROR) {
                    updatedState = formStateObject(login, iPassword, iDegree, false, true, false);
                }
                else if (cycleProgram.type === PACKAGE.RESPONSE_TYPE.OK)
                    updatedState = formStateObject(login, iPassword, iDegree, false, false, false);
                break;
        }

        setCredentials(updatedState.credentials);
        setErrors(updatedState.errors);
        setPopupMessages(updatedState.popupMessages);
        iLoadButtonSetter(false);
    }

    let content = <Login loginHandler={handleLogin} />;

    if (sErrors.server) {
        content = <ServerError errorType={SERVER_ERROR_TYPE.INSIDE} />;
    } else if (sCredentials.login && sCredentials.password && !sErrors.loginPassword && !sErrors.degree)
        content = <Content login={sCredentials.login} password={sCredentials.password} degree={sCredentials.degree} />;

    return (<div>
        {content}
        <MessageBar
            severity='error'
            isOpen={sPopupMessages.loginPassword}
            content={CREDS_SNACK}
            closeHandler={() => setPopupMessages(messages => ({ ...messages, loginPassword: false }))}
        />
        <MessageBar
            severity='error'
            isOpen={sPopupMessages.degree}
            content={DEGREE_SNACK}
            closeHandler={() => setPopupMessages(messages => ({ ...messages, degree: false }))}
        />
    </div>);
}

export default App;