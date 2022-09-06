import { PACKAGE } from './const';

function credsErrorResponse() {
    return {
        type: PACKAGE.RESPONSE_TYPE.CREDENTIALS_ERROR
    }
}

function serverErrorResponse() {
    return {
        type: PACKAGE.RESPONSE_TYPE.SERVER_ERROR
    }
}

function okResponse(iData) {
    return {
        type: PACKAGE.RESPONSE_TYPE.OK,
        data: iData
    }
}

async function fetchIomProgramsCompleted_loc(iToken, iCycleId, iDegree) {
    let link;

    if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile/my-plan/extra-elements?cycleId=' + iCycleId + '&completed=true';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile/my-plan/extra-elements?cycleId=' + iCycleId + '&completed=true';

    return fetch(link, {
        method: 'GET',
        headers: {
            'Authorization': iToken
        },
    })
        .then(res => res.json())
        .then(json => {
            if (json.errorCode) {
                console.log("fetchIomProgramsCompleted_loc -");
                return credsErrorResponse();
            }

            const passedPrograms = json;
            const response = passedPrograms.map(program => ({
                'id': program.id,
                'name': program.title,
                'zet': program.zet,
                'included': true,
                'mastered': true,
                'error': null
            }));

            console.log('fetchIomProgramsCompleted_loc +');
            return okResponse(response);
        })
        .catch(error => {
            console.log('fetchIomProgramsCompleted_loc --');
            console.log(error);
            return serverErrorResponse();
        })
}
async function fetchIomPrograms_loc(iToken, iCycleId, iProgramId, iDegree) {
    let link;

    if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
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
                console.log("fetchIomPrograms_loc -");
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

            console.log('fetchIomPrograms_loc +');
            return okResponse(response);
        })
        .catch(error => {
            console.log('fetchIomPrograms_loc --');
            console.log(error);
            return serverErrorResponse();
        })
}

export const queries = {
    fetchIdpTicket: async function fetchIdpTicket(iLogin, iPassword, iDegree) {
        const link = "https://a.edu.rosminzdrav.ru/idp/auth?type=custom";

        let data;

        if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
            data = { "username": iLogin, "password": iPassword, "responseType": "client-ticket", "locale": null, "useAccessible": false, "accessibleMode": "WHITE", "serviceProviderUrl": "https://nmfo-spo.edu.rosminzdrav.ru/#/login/" };
        else
            data = { "username": iLogin, "password": iPassword, "responseType": "client-ticket", "locale": null, "useAccessible": false, "accessibleMode": "WHITE", "serviceProviderUrl": "https://nmfo-vo.edu.rosminzdrav.ru/#/login/" };

        return fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
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
    },
    fetchToken: async function fetchToken(iIdpTicket, iDegree) {
        let link;

        if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
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
    },
    fetchCycleProgram: async function fetchCycleProgram(iToken, iDegree) {
        let link;

        if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
            link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/profile/cycles';
        else
            link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/profile/cycles';

        return fetch(link, {
            method: 'GET',
            headers: {
                'Authorization': iToken,
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
    },
    fetchZets: async function fetchZets(iToken, iDegree) {
        let link;

        if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
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
    },
    fetchIomPrograms: async function fetchIomPrograms(iToken, iCycleId, iProgramId, iDegree) {
        const passedProgramsRow = await fetchIomProgramsCompleted_loc(iToken, iCycleId, iDegree);
        let passedPrograms = null;
        if (passedProgramsRow.type === PACKAGE.RESPONSE_TYPE.CREDENTIALS_ERROR)
            return passedPrograms;
        else
            passedPrograms = passedProgramsRow.data;

        const programsRow = await fetchIomPrograms_loc(iToken, iCycleId, iProgramId, iDegree);
        let programs = null;
        if (programsRow.type === PACKAGE.RESPONSE_TYPE.CREDENTIALS_ERROR)
            return programs;
        else
            programs = programsRow.data;

        const response = {
            'masteredT': passedPrograms,
            'masteredF': programs,
        }

        return okResponse(response);
    },
    fetchName: async function fetchName(iToken, iDegree) {
        let link;

        if (iDegree === PACKAGE.DEGREE.PROFESSIONAL_EDUCATION)
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
}