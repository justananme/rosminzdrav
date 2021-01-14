const { DEGREE } = require('./const');
const fetch = require('node-fetch');

async function getProgramOpenUrl(iProgramId, iCycleId, iToken, iDegree) {
    let link1 = null;
    let link2 = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION) {
        link1 = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';
        link2 = 'https://nmfo-spo.edu.rosminzdrav.ru/#/user-account/view-iom/' + iProgramId + '?cycleId=';
    }
    else {
        link1 = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';
        link2 = 'https://nmfo-vo.edu.rosminzdrav.ru/#/user-account/view-iom/' + iProgramId + '?cycleId=';
    }

    const url = link1 + iProgramId + '/open-link?backUrl=' + link2 + iCycleId;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iToken,
            'Connection': 'keep-alive',
            'TE': 'Trailers'
        }
    })
        .then(res => res.json())
        .then(json => {
            return json.url;
        })
        .catch(error => {
            return error;
        })
}

async function getIdpTicket(iLogin, iPassword) {
    const link = "https://a.edu.rosminzdrav.ru/idp/auth?type=custom";
    const data = { "username": iLogin, "password": iPassword, "responseType": "server-ticket", "locale": null, "useAccessible": false };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(
            (json) => {
                const url = new URL(json.serviceProviderUrl);
                const idpTicket = url.searchParams.get("idp_ticket");

                return idpTicket;
            },
            (error) => {
                return error;
            }
        )
}

async function getToken(iIdpTicket, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/v2/idp/token';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/v2/idp/token';

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'TE': 'Trailers'
        },
        body: 'idp_ticket=' + iIdpTicket,
    })
        .then(res => res.json())
        .then(
            (json) => {
                return "Bearer " + json.access_token;
            },
            (error) => {
                return error;
            }
        )
}

async function getTokenRest(iIdpTicket, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/idp/token?idp_ticket=';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/idp/token?idp_ticket=';

    return fetch(link + iIdpTicket, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'ru',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
        },
    })
        .then(res => res.json())
        .then(
            (json) => {
                return "Bearer " + json.access_token;
            },
            (error) => {
                return error;
            }
        )
}

async function addProgramToCycle(iCycleId, iProgramId, iToken, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';

    const data = 'cycleId=' + iCycleId;

    return fetch(link + iProgramId + '/plan?cycleId=' + iCycleId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iToken,
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'TE': 'Trailers'
        },
        body: JSON.stringify(data),
    })
        .then(() => { })
        .catch(error => {
            return error;
        })
}
async function removeProgramFromCycle(iCycleId, iProgramId, iToken, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://nmfo-spo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';
    else
        link = 'https://nmfo-vo.edu.rosminzdrav.ru/api/api/educational-elements/iom/';

    const data = 'cycleId=' + iCycleId;

    return fetch(link + iProgramId + '/plan?cycleId=' + iCycleId, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iToken,
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'TE': 'Trailers'
        },
        body: JSON.stringify(data),
    })
        .then(() => { })
        .catch(error => {
            return error;
        })
}

async function getVariants(iTokenRest, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantsOfCurrentUserRest';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantsOfCurrentUserRest';

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'ru',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iTokenRest,
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
        },
    })
        .then(res => res.json())
        .then(
            (json) => {
                return json;
            },
            (error) => {
                return error;
            }
        )
}

async function getVariant(iTokenRest, iVariantId, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantOfCurrentSolverRest';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantOfCurrentSolverRest';

    const data = { 'variantId': iVariantId };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'ru',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iTokenRest,
            'Content-Type': 'application/json; charset=UTF-8',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(
            (json) => {
                return json.result;
            },
            (error) => {
                return error;
            }
        )
}

async function startTest(iTokenRest, iVariantId, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantOfCurrentSolverRest';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/getVariantOfCurrentSolverRest';

    const data = { 'variantId': iVariantId };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iTokenRest,
            'Content-Type': 'application/json; charset=UTF-8',
            'Connection': 'keep-alive',
            'TE': 'Trailers',
        },
        body: JSON.stringify(data),
    })
        .then(res => {
            return true;
        })
}

async function saveVariantAnswers(iTokenRest, iAnswers, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/saveVariantAnswers';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/saveVariantAnswers';

    const data = { 'answers': iAnswers };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'ru',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iTokenRest,
            'Content-Type': 'application/json; charset=UTF-8',
            'Connection': 'keep-alive',
            'TE': 'Trailers',
        },
        body: JSON.stringify(data),
    })
        .then(res => {
            return true;
        })
}

async function completeTest(iTokenRest, iVariantId, iDegree) {
    let link = null;

    if (iDegree === DEGREE.PROFESSIONAL_EDUCATION)
        link = 'https://iomqt-spo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/completeTestRest';
    else
        link = 'https://iomqt-vo.edu.rosminzdrav.ru/api/rest/v2/services/qt_QtService/completeTestRest';

    const data = { 'variantId': iVariantId };

    return fetch(link, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'ru',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': iTokenRest,
            'Content-Type': 'application/json; charset=UTF-8',
            'Connection': 'keep-alive',
            'TE': 'Trailers',
        },
        body: JSON.stringify(data),
    })
        .then(res => {
            return true;
        })
}

module.exports.addProgramToCycle = addProgramToCycle;
module.exports.removeProgramFromCycle = removeProgramFromCycle;
module.exports.getIdpTicket = getIdpTicket;
module.exports.getToken = getToken;
module.exports.getTokenRest = getTokenRest;
module.exports.getVariants = getVariants;
module.exports.getVariant = getVariant;
module.exports.startTest = startTest;
module.exports.saveVariantAnswers = saveVariantAnswers;
module.exports.completeTest = completeTest;
module.exports.getProgramOpenUrl = getProgramOpenUrl;