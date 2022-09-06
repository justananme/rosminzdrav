const express = require('express');
const WebSocket = require('ws');
const http = require('http');
var cors = require('cors');
const puppeteer = require('puppeteer');
const sql = require("mssql/msnodesqlv8");

const { getIdpTicket, getToken, getTokenRest, addProgramToCycle, removeProgramFromCycle, getVariants, getVariant, startTest, saveVariantAnswers, completeTest, getProgramOpenUrl } = require('./general');
const { SELECTORS, OTHERS, RES_HEADER_TYPE, TEST_TYPE, RES_HEADER_VALUE, SUPPORTED_HOSTS, SQL_CONFIG, SERVER_PORT } = require('./const');

let app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let ws = null;

let browser = null;
let page = null;
let userLogin = null;
let wsCloseCode = 0;
let madeSolving = false;
const browserTimeout = 25000;

const thepool = new sql.ConnectionPool(SQL_CONFIG);
const poolConnect = thepool.connect();

app.get('/unsupportedPrograms', async (req, res) => {
    const unsupportedPrograms = await getUnsupportedPrograms();
    res.json(unsupportedPrograms);
})

wss.on('connection', lws => {
    ws = lws;

    ws.on('message', async message => {
        const data = JSON.parse(message);
        if (data.type === RES_HEADER_TYPE.CONTROLLER && data.value === RES_HEADER_VALUE.OBTAIN_PROFILE) {
            const idpTicket = await getIdpTicket(data.login, data.password);
            if (!(idpTicket instanceof Error)) {
                await sendUser(data.login, data.password);
                await setLastQueryDate(data.login);
            }
        }
        else if (data.type === RES_HEADER_TYPE.CONTROLLER && data.value === RES_HEADER_VALUE.COMPLETE_TESTS) {
            const idpTicket = await getIdpTicket(data.data.profile.login, data.data.profile.password);
            if (!(idpTicket instanceof Error))
                await complete(data.data);
        }

    })
    ws.on('close', (e) => {
        wsCloseCode = e;

        if (e != 4001) {
            const serverErrorWC = getServerErrorWC();
            const serverErrorWCJSON = JSON.stringify(serverErrorWC);
            ws.send(serverErrorWCJSON);
        }

        if (browser)
            browser.close();

        ws = null;
    })
})

async function sendUser(iLogin, iPassword) {
    const user = await getUser(iLogin, iPassword);
    const userWC = sendUserWC(user);
    const userJson = JSON.stringify(userWC);
    ws.send(userJson);
}

async function closeCompletedPopup(iSelfCall) {
    if (!iSelfCall)
        return false;

    const popupExists = (await page.$(SELECTORS.CLOSE_TEST_POPUP) !== null);

    if (popupExists) {
        await page.waitForSelector(SELECTORS.CLOSE_TEST_BUTTON, { timeout: browserTimeout });

        const withButtons = await page.$eval(SELECTORS.CLOSE_TEST_BUTTON, (head, SELECTORS) => {
            let result = false;

            let nodesArr = Array.from([head]);
            const lclasses = nodesArr[0].classList;

            for (const lclass of lclasses) {
                if (lclass === SELECTORS.CLOSE_TEST_BUTTON_DISABLED) {
                    result = true;
                    break;
                }
            }

            return result;
        }, SELECTORS);

        if (!withButtons) {
            const closeTestButton = await page.$(SELECTORS.CLOSE_TEST_BUTTON);
            closeTestButton.click();
            await page.waitFor(3000);
        } else {
            const closeTestButton = await page.$(SELECTORS.CLOSE_TEST_BUTTON_INSIDE);
            closeTestButton.click();
            await page.waitFor(3000);
        }
    }

    const popupExists2 = (await page.$(SELECTORS.CLOSE_TEST_POPUP) !== null);

    await closeCompletedPopup(popupExists2);
}

function getHeader(iProgramId, iProgramName, iType, iQuestionsAmount, iQuestionIndex) {
    const name = iProgramName;
    let status = iQuestionIndex / iQuestionsAmount * 100;

    const header = {
        type: RES_HEADER_TYPE.HEADER,
        testType: iType,
        id: iProgramId,
        name: name,
        status: status,
        zeroHeader: false
    }

    return header;
}
function sendUserWC(iUser) {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.OBTAIN_PROFILE,
        user: iUser
    }
}
function getTestsCompletedWC() {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.TESTS_COMPLETED
    }
}
function getTestCompletedWC(iProgramId, iLast) {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.TEST_COMPLETED,
        programId: iProgramId,
        last: iLast
    }
}
function getNoCertificateWC(iProgramId, iLast) {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.CERTIFICATE_NOT_OBTAINED,
        programId: iProgramId,
        last: iLast
    }
}
function getUnsupportedHostnameWC(iProgramId, iLast) {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.UNSUPPORTED_HOSTNAME,
        programId: iProgramId,
        last: iLast
    }
}
function getProgramsLimitWC(iCount) {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.PROGRAMS_LIMIT,
        programsLeft: iCount,
    }
}
function getTokenRestErrorWC() {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.TOKEN_REST_ERROR,
    }
}
function getServerErrorWC() {
    return {
        type: RES_HEADER_TYPE.CONTROLLER,
        value: RES_HEADER_VALUE.SERVER_ERROR,
    }
}

async function login(iClientData) {
    await page.waitForSelector(SELECTORS.USERNAME, { timeout: browserTimeout });
    await page.type(SELECTORS.USERNAME, iClientData.profile.login, { delay: 200 });

    await page.waitForSelector(SELECTORS.PASSWORD, { timeout: browserTimeout });
    await page.type(SELECTORS.PASSWORD, iClientData.profile.password, { delay: 200 });

    await page.waitForSelector(SELECTORS.LOGIN_BUTTON, { timeout: browserTimeout });
    const loginButton = await page.$(SELECTORS.LOGIN_BUTTON);
    const loginPromise = page.waitForNavigation();
    await loginButton.click();
    await loginPromise;
    await page.waitFor(2000);
}

function getVariantId(iVariants, iVariantNumber) {
    let variantId = null;

    for (let variant of iVariants) {
        const variantReg = /(\d+)/;
        const variantNumber = variantReg.exec(variant.name)[0];
        if (variantNumber === iVariantNumber) {
            variantId = variant.id;

            break;
        }
    }

    return variantId;
}
async function getVariantNumber(final) {
    const variantType = final ? OTHERS.FINAL_ROW_TEXT : OTHERS.TEST_ROW_TEXT;

    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS, { timeout: browserTimeout });
    const quickNavTable = await page.$(SELECTORS.QUICK_NAV_TEST_ROWS);

    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS_2, { timeout: browserTimeout });
    let quickNavRowIndex = await quickNavTable.$$eval(SELECTORS.QUICK_NAV_TEST_ROWS_2, (nodes, variantType) => {
        let nodesArr = Array.from(nodes);
        nodesArr.splice(0, 1);

        let index = null;

        for (let i = 0; i < nodesArr.length; i++) {
            const rowTextFormated = nodesArr[i].innerText.replace(/[0-9]/g, '');
            if (rowTextFormated === variantType) {
                index = i;
                break;
            }
        }

        index += 1;

        return index;
    }, variantType);

    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS_2, { timeout: browserTimeout });
    const quickNavRows = await quickNavTable.$$(SELECTORS.QUICK_NAV_TEST_ROWS_2);
    const quickNavRow = await quickNavRows[quickNavRowIndex].$('.v-horizontallayout.v-layout.v-horizontal.v-widget > div:nth-child(2) > div');
    await quickNavRow.click();
    await page.waitFor(2000);


    await page.waitForSelector(SELECTORS.GET_NEW_VARIANT_BUTTON, { timeout: browserTimeout });
    const variantButton = await page.$(SELECTORS.GET_NEW_VARIANT_BUTTON);
    const variantButtonClass = await variantButton.evaluate(node => node.className);
    const isVariantButtonClassEnabled = variantButtonClass === OTHERS.VARIANT_BUTTON_ENABLED;

    if (isVariantButtonClassEnabled) {
        variantButton.click();
        await page.waitFor(5000);
    }

    await page.waitForSelector(SELECTORS.VARIANT, { timeout: browserTimeout });
    const variantNodes = await page.$$(SELECTORS.VARIANT);
    const variantTextProp = await variantNodes[variantNodes.length - 1].getProperty('textContent');
    const variantText = await variantTextProp.jsonValue();
    const variantReg = /(\d+)/;
    const variantNumber = variantReg.exec(variantText)[0];

    return variantNumber;
}

async function quickNavElementStatus(iElement) {
    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS, { timeout: browserTimeout });
    const quickNavTable = await page.$(SELECTORS.QUICK_NAV_TEST_ROWS);
    const status = await quickNavTable.$$eval(SELECTORS.QUICK_NAV_TEST_ROWS_2, (nodes, iElement) => {
        let lindex = null;
        let ldisabled = false;

        let nodesArr = Array.from(nodes);
        nodesArr.splice(0, 1);

        for (let i = 0; i < nodesArr.length; i++) {
            const rowTextFormated = nodesArr[i].innerText.replace(/[0-9]/g, '');
            if (rowTextFormated === iElement) {
                lindex = i;
                const classList = nodesArr[i].querySelector('div[tabindex="0"]').classList;

                for (const lclass of classList) {
                    if (lclass === "gray-link-button" || lclass === "v-button-gray-link-button") {
                        ldisabled = true;
                        break;
                    }
                }
                break;
            }
        }

        const lstatus = {
            index: lindex + 1,
            disabled: ldisabled
        };

        return lstatus;
    }, iElement);

    return status;
}

async function obtainCertificate(iProgramId, iLast) {
    let result = false;

    const certificateStatus = await quickNavElementStatus(OTHERS.CERTIFICATE);
    if (certificateStatus.disabled)
        result = getNoCertificateWC(iProgramId, iLast);

    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS, { timeout: browserTimeout });
    const quickNavTable = await page.$(SELECTORS.QUICK_NAV_TEST_ROWS);
    await page.waitForSelector(SELECTORS.QUICK_NAV_TEST_ROWS_2, { timeout: browserTimeout });
    const quickNavRows = await quickNavTable.$$(SELECTORS.QUICK_NAV_TEST_ROWS_2);
    const quickNavRow = await quickNavRows[certificateStatus.index].$('.v-horizontallayout.v-layout.v-horizontal.v-widget > div:nth-child(2) > div');
    await quickNavRow.click();

    await page.waitFor(2000);


    return result;
}

async function solve(iTokenRest, iVariantNumber, iProgram, iTestType, iDegree) {
    const variants = await getVariants(iTokenRest, iDegree);
    const variantId = getVariantId(variants, iVariantNumber);
    const variant = await getVariant(iTokenRest, variantId, iDegree);

    await startTest(iTokenRest, variant.id, iDegree);

    if (iTestType === TEST_TYPE.FINAL)
        madeSolving = true;

    const questions = variant.questions;

    for (let i = 0; i < questions.length; i++) {
        const index = i + 1;

        const answers = questions[i].answers.map(answer => {
            let newAnswer = answer;

            if (newAnswer.isTrue)
                newAnswer.selectedByStudent = true;

            return newAnswer;
        });

        const header = await getHeader(iProgram.id, iProgram.name, iTestType, questions.length, index);
        const responseJSON = JSON.stringify(header);

        await new Promise(resolve => setTimeout(() => resolve(saveVariantAnswers(iTokenRest, answers, iDegree)), 1500));
        ws.send(responseJSON);
    }

    await new Promise(resolve => setTimeout(() => resolve(completeTest(iTokenRest, variant.id, iDegree)), 1500));

    if (iTestType === TEST_TYPE.FINAL)
        madeSolving = false;
}

async function gotoPage(iUrl) {
    await page.close();
    page = await browser.newPage();
    await page.goto(iUrl, { 'waitUntil': 'domcontentloaded' });
    await page.waitFor(3000);

    await closeCompletedPopup((await page.$(SELECTORS.CLOSE_TEST_POPUP) !== null));
}
function getHostName(iURL) {
    const urlLink = new URL(iURL);
    return urlLink.hostname;
}

async function addUnsupportedProgram(iProgramId, iHostName) {
    await poolConnect.then(async pool => {
        await pool.request()
            .input('programId', iProgramId)
            .input('hostName', iHostName)
            .execute('addUnsupportedProgram')
    });
}
async function getUnsupportedPrograms() {
    let unsupportedPrograms = null;

    await poolConnect.then(async pool => {
        await pool.request()
            .query('select programId from unsupportedPrograms')
            .then(result => {
                let locUnsupportedPrograms = [];

                for (let unsupportedProgram of result.recordset) {
                    locUnsupportedPrograms.push(unsupportedProgram.programId)
                }

                unsupportedPrograms = locUnsupportedPrograms;
            })
    });

    return unsupportedPrograms;
}
async function getUser(iLogin, iPassword) {
    let resuser = null;
    await poolConnect.then(async pool => {
        await pool.request()
            .input('snils', iLogin)
            .input('password', iPassword)
            .execute('getUser')
            .then(result => {
                const user = {
                    login: result.recordset[0].snils,
                    vip: result.recordset[0].vip,
                    queriesLeft: result.recordset[0].queries_left,
                    queryLast: result.recordset[0].query_last
                }

                resuser = user;
            })
    });

    return resuser;
}
async function decrementLimit(iLogin) {
    await poolConnect.then(async pool => {
        await pool.request()
            .input('snils', iLogin)
            .execute('decrementUserLimit')
    });
}
async function incrementLimit(iLogin) {
    await poolConnect.then(async pool => {
        await pool.request()
            .input('snils', iLogin)
            .execute('incrementUserLimit')
    });
}
async function incrementQueries(iLogin) {
    await poolConnect.then(async pool => {
        await pool.request()
            .input('snils', iLogin)
            .execute('incrementQueriesMade')
    });
}
async function decrementQueries(iLogin) {
    await poolConnect.then(async pool => {
        await pool.request()
            .input('snils', iLogin)
            .execute('decrementQueriesMade')
    });
}

async function setLastQueryDate(iLogin) {
    await poolConnect.then(async pool => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes();
        const datetime = date + ' ' + time;

        await pool.request()
            .input('snils', iLogin)
            .input('queryLast', datetime)
            .execute('setLastQueryDate')
    });
}

async function clickQuickNavButton() {
    await page.waitForSelector(SELECTORS.QUICK_NAV_BUTTON, { timeout: browserTimeout });
    const quickNavButton = await page.$(SELECTORS.QUICK_NAV_BUTTON);
    quickNavButton.click();
    await page.waitFor(2000);
}

async function complete(iClientData) {
    try {
        userLogin = iClientData.profile.login;
        let user = await getUser(iClientData.profile.login, iClientData.profile.password);

        if (!user.vip && user.queriesLeft < iClientData.programs.length) {
            const testCompletedHeader = getProgramsLimitWC(user.queries_left);
            const testCompletedHeaderJSON = JSON.stringify(testCompletedHeader);
            ws.send(testCompletedHeaderJSON);

            return;
        }

        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();

        await gotoPage(OTHERS.LOGIN_PAGE);

        await login(iClientData);

        const tokenIdpTicket = await getIdpTicket(iClientData.profile.login, iClientData.profile.password);
        const token = await getToken(tokenIdpTicket, iClientData.profile.degree);
        const tokenRestIdpTicket = await getIdpTicket(iClientData.profile.login, iClientData.profile.password);
        const tokenRest = await getTokenRest(tokenRestIdpTicket, iClientData.profile.degree);

        if (tokenRest === 'Bearer undefined') {
            const tokenRestErrorWC = getTokenRestErrorWC();
            const tokenRestErrorJSON = JSON.stringify(tokenRestErrorWC);
            ws.send(tokenRestErrorJSON);

            await browser.close();

            return;
        }

        for (let i = 0; i < iClientData.programs.length; i++) {
            const program = iClientData.programs[i];
            const lastTest = i === iClientData.programs.length - 1;
            let madeIncluding = false;

            if (!program.included) {
                await addProgramToCycle(iClientData.profile.cycleId, program.id, token, iClientData.profile.degree);
                await page.waitFor(3000);

                madeIncluding = true;
            }

            const programOpenUrl = await getProgramOpenUrl(program.id, iClientData.profile.cycleId, token, iClientData.profile.degree);
            const hostName = getHostName(programOpenUrl);
            if (hostName !== SUPPORTED_HOSTS.HOST_1_VO && hostName !== SUPPORTED_HOSTS.HOST_1_SPO) {
                if (madeIncluding)
                    await removeProgramFromCycle(iClientData.profile.cycleId, program.id, token, iClientData.profile.degree);

                await addUnsupportedProgram(program.id, hostName);

                const unsupportedHostnameWC = getUnsupportedHostnameWC(program.id, lastTest);
                const unsupportedHostnameJSON = JSON.stringify(unsupportedHostnameWC);
                ws.send(unsupportedHostnameJSON);

                continue;
            }

            await gotoPage(programOpenUrl);

            await clickQuickNavButton();

            const isCertificate = await quickNavElementStatus(OTHERS.CERTIFICATE);

            if (isCertificate.disabled) {
                const tmpIsFinal = await quickNavElementStatus(OTHERS.FINAL_ROW_TEXT);
                const isFinal = !tmpIsFinal.disabled;

                if (!isFinal) {

                    const variantNumberTest = await getVariantNumber(false);

                    await solve(tokenRest, variantNumberTest, program, TEST_TYPE.TEST, iClientData.profile.degree);
                    await gotoPage(programOpenUrl);
                    await clickQuickNavButton();
                }

                const variantNumberFinal = await getVariantNumber(true);

                if (!user.vip)
                    await decrementLimit(iClientData.profile.login);
                await incrementQueries(iClientData.profile.login);

                await solve(tokenRest, variantNumberFinal, program, TEST_TYPE.FINAL, iClientData.profile.degree);
                await gotoPage(programOpenUrl);

            }
            else {
                const popupExists = (await page.$(SELECTORS.CLOSE_TEST_POPUP) !== null);
                await closeCompletedPopup(popupExists);
            }

            try {
                await clickQuickNavButton();

                const certificateError = await obtainCertificate(program.id, lastTest);

                if (certificateError) {
                    if (!user.vip)
                        await incrementLimit(iClientData.profile.login);
                    await decrementQueries(iClientData.profile.login);

                    const certificateErrorJSON = JSON.stringify(certificateError);
                    ws.send(certificateErrorJSON);
                }
                else {

                    const testCompletedHeader = getTestCompletedWC(program.id, lastTest);
                    const testCompletedHeaderJSON = JSON.stringify(testCompletedHeader);
                    ws.send(testCompletedHeaderJSON);
                }

                const updatedUser = await getUser(iClientData.profile.login, iClientData.profile.password);
                const updatedUserWC = sendUserWC(updatedUser);
                const updatedUserJson = JSON.stringify(updatedUserWC);
                ws.send(updatedUserJson);
            }
            catch (err) {
                if (!user.vip)
                    await incrementLimit(iClientData.profile.login);
                await decrementQueries(iClientData.profile.login);

                const noCertificateWC = getNoCertificateWC(program.id, lastTest);
                const noCertificateJSON = JSON.stringify(noCertificateWC);
                ws.send(noCertificateJSON);
            }
        }

        const testsCompletedHeader = getTestsCompletedWC();
        const testsCompletedHeaderJSON = JSON.stringify(testsCompletedHeader);
        await new Promise(resolve => setTimeout(() => resolve(ws.send(testsCompletedHeaderJSON)), 1000));

        await browser.close();
    }
    catch (err) {
        if (ws) {
            if (wsCloseCode && userLogin) {
                if (wsCloseCode !== 1001 && madeSolving === true) {
                    if (!user.vip)
                        await incrementLimit(userLogin);
                    await decrementQueries(userLogin);
                }
            }

            const serverErrorWC = getServerErrorWC();
            const serverErrorWCJSON = JSON.stringify(serverErrorWC);
            ws.send(serverErrorWCJSON);

            ws.close(4001);
        }
    }
}
server.listen(SERVER_PORT);