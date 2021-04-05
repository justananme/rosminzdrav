import { RES_TYPE, DEGREE } from './const';

function credsErrorResponse() {
    return {
        type: RES_TYPE.CREDS_ERROR
    }
}

function serverErrorResponse() {
    return {
        type: RES_TYPE.SERVER_ERROR
    }
}

function okResponse(iData) {
    return {
        type: RES_TYPE.OK,
        data: iData
    }
}

export async function getIdpTicket(iLogin, iPassword, iDegree) {
    const link = "https://a.edu.rosminzdrav.ru/idp/auth?type=custom";

    let data = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        data = { "username": iLogin, "password": iPassword, "responseType": "client-ticket", "locale": null, "useAccessible": false, "accessibleMode": "WHITE", "serviceProviderUrl": "https://nmfo-spo.edu.rosminzdrav.ru/#/login/" };
    else
        data = { "username": iLogin, "password": iPassword, "responseType": "client-ticket", "locale": null, "useAccessible": false, "accessibleMode": "WHITE", "serviceProviderUrl": "https://nmfo-vo.edu.rosminzdrav.ru/#/login/" };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Referer': 'https://a.edu.rosminzdrav.ru/idp/login.html?response_type=client-ticket&sp=https://nmfo-spo.edu.rosminzdrav.ru/#/login/',
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("idpTicket fetch -");
                return credsErrorResponse();
            }

            const url = new URL(json.serviceProviderUrl);
            const idpParam = url.href.substring(url.href.indexOf('#') + 1);
            const idpTicket = idpParam.substring(idpParam.indexOf('=') + 1);

            console.log("idpTicket fetch +");
            return okResponse(idpTicket);
        })
        .catch(error => {
            console.log('idpTicket fetch --');
            console.log(error);
            return serverErrorResponse();
        })
}

export async function getToken(iIdpTicket, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/v2/idp/token';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/v2/idp/token';

    return fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
        },
        body: 'idp_ticket=' + iIdpTicket,
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("token fetch -");
                return credsErrorResponse();
            }
            const bearer = "Bearer " + json.access_token

            console.log("token fetch +");
            return okResponse(bearer);
        })
        .catch(error => {
            console.log('token fetch --');
            console.log(error);
            return serverErrorResponse();
        })
}

export async function getCycleProgram(iToken, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile/cycles';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile/cycles';

    return fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': iToken,
            'Referer': 'https://nmfo-spo.edu.rosminzdrav.ru/'
        }
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("cycle-program -");
                return credsErrorResponse();
            }
            const result = { "cycleId": json[0].id, programId: json[0].programId };

            console.log("cycle-program +");
            return okResponse(result);
        })
        .catch(error => {
            console.log('cycle-program --');
            console.log(error);
            return serverErrorResponse();
        })
}

export async function getZets(iToken, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile/statistics/my-progress-zet';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile/statistics/my-progress-zet';

    return fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': iToken
        }
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("zets -");
                return credsErrorResponse();
            }
            const result = json.iomZet + json.trainingProgrammeZet + json.educationElementZet + json.otherZet;

            console.log("zets +");
            return okResponse(result);
        })
        .catch(error => {
            console.log('zets --');
            console.log(error);
            return serverErrorResponse();
        })
}

export async function getIomPrograms(iToken, iCycleId, iProgramId, iDegree) {
    const passedProgramsRow = await getIomProgramsCompleted_loc(iToken, iCycleId, iDegree);
    let passedPrograms = null;
    if (passedProgramsRow.type === RES_TYPE.CREDS_ERROR)
        return passedPrograms;
    else
        passedPrograms = passedProgramsRow.data;

    const programsRow = await getIomPrograms_loc(iToken, iCycleId, iProgramId, iDegree);
    let programs = null;
    if (programsRow.type === RES_TYPE.CREDS_ERROR)
        return programs;
    else
        programs = programsRow.data;

    const unsupportedProgramsRow = await getUnsupportedPrograms_loc();
    let unsupportedPrograms = null;
    if (unsupportedProgramsRow.type === RES_TYPE.CREDS_ERROR)
        return unsupportedPrograms;
    else
        unsupportedPrograms = unsupportedProgramsRow.data;

    const supportedPrograms = programs.filter(program => {
        let isSupported = true;

        for (let unsupportedProgram of unsupportedPrograms) {
            if (program.id === unsupportedProgram) {
                isSupported = false;
                break;
            }
        }

        return isSupported;
    })

    const response = {
        'masteredT': passedPrograms,
        'masteredF': supportedPrograms,
    }

    return okResponse(response);
}
async function getIomProgramsCompleted_loc(iToken, iCycleId, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile/my-plan?cycleId=' + iCycleId;
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile/my-plan?cycleId=' + iCycleId;

    return fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': iToken
        },
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("getIomProgramsCompleted_loc -");
                return credsErrorResponse();
            }

            const includedPrograms = json.extraElements;
            const passedPrograms = includedPrograms.filter(program => program.status === 'confirmed'); //??? what about completed?
            const response = passedPrograms.map(program => ({
                'id': program.id,
                'name': program.title,
                'zet': program.zet,
                'included': true,
                'mastered': true,
                'error': null
            }));

            console.log('getIomProgramsCompleted_loc +');
            return okResponse(response);
        })
        .catch(error => {
            console.log('getIomProgramsCompleted_loc --');
            console.log(error);
            return serverErrorResponse();
        })
}
async function getIomPrograms_loc(iToken, iCycleId, iProgramId, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/educational-elements/search';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/educational-elements/search';

    const data = {
        'cycleId': iCycleId, 'limit': 1500, 'programId': [iProgramId], 'elementType': 'iom',
        'offset': 0, 'startDate': null, 'endDate': null, 'chargeTypes': ['budget']
    }

    return fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': iToken

        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("getIomPrograms_loc -");
                return credsErrorResponse();
            }

            const result = json.elements.map(program => ({
                'id': program.elementId,
                'name': program.elementName,
                'zet': program.zet,
                'included': program.includedIntoPlan,
                'mastered': program.mastered,
                'error': null
            }));

            const response = result.filter(program => !program.mastered && program.zet > 0);

            console.log('getIomPrograms_loc +');
            return okResponse(response);
        })
        .catch(error => {
            console.log('getIomPrograms_loc --');
            console.log(error);
            return serverErrorResponse();
        })
}
async function getUnsupportedPrograms_loc() {
    return fetch('http://localhost:8999/unsupportedPrograms', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("unsupportedPrograms_loc -");
                return credsErrorResponse();
            }

            console.log('unsupportedPrograms_loc +');
            return okResponse(json);
        })
        .catch(error => {
            console.log('unsupportedPrograms_loc --');
            console.log(error);
            return serverErrorResponse();
        })
}

export async function getName(iToken, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile';

    return fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': iToken
        }
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("name -");
                return credsErrorResponse();
            }
            const result = json.lastName + ' ' + json.firstName;

            console.log("name +");
            return okResponse(result);
        })
        .catch(error => {
            console.log('name --');
            console.log(error);
            return serverErrorResponse();
        })
}
