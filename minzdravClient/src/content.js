import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { ruRU } from '@material-ui/core/locale';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Profile from './userProfile.js';
import ProgTable from './progTable';
import ProgTableCompleted from './progTableCompleted';
import Log from './log';
import TabsLight from './tabs';
import DialogBalance from './dialogBalance';
import DialogNewbie from './dialogNewbie';
import Preloader from './preloader';
import ServerError from './serverError';

import { getIdpTicket, getToken, getCycleProgram, getIomPrograms, getZets, getName } from "./profile";
import {
  RES_TYPE, RES_HEADER_TYPE, RES_HEADER_VALUE, SERVER, TEST_TYPE, ERROR_CAUSES, CERTIFICATE_SNACK, UNSUPPORTED_HOST_SNACK, TOKENREST_ERROR_SNACK_1,
  PRELOADER_STEP_1, PRELOADER_STEP_2, PRELOADER_STEP_3, PROGRAMS_LIMIT_SNACK_1, PROGRAMS_LIMIT_SNACK_2, SERVER_ERROR_TYPE
} from './const'

const theme = createMuiTheme({
}, ruRU);

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sPreloaderText: PRELOADER_STEP_1,
      sIdpTicket: null,
      sToken: null,
      sDegree: null,
      sCycleId: null,
      sProgramId: null,
      sUserName: null,
      sZets: null,
      sIomPrograms: null,
      sTableHeader: null,
      sSelectedRows: [],
      sSelectedZets: 0,
      sNotifications: 0,
      sDisabled: false,
      sServerError: false,
      sProfile: null,
      sSnackLimit: null,
      sSnackCertificate: null,
      sSnackHostName: null,
      sSnackTokenRest_1: null,
      sServerErrorType: SERVER_ERROR_TYPE.OUTSIDE,
      sDialogBalanceOpen: false,
      sDialogNewbieOpen: false,
    };

    this.handleTableSubmit = this.handleTableSubmit.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleSelectRowsAll = this.handleSelectRowsAll.bind(this);
    this.prepareSelectedRows = this.prepareSelectedRows.bind(this);
    this.handleClearNotifications = this.handleClearNotifications.bind(this);
    this.moveTestToCompleted = this.moveTestToCompleted.bind(this);
    this.getCredentialsWC = this.getCredentialsWC.bind(this);
    this.completeTestsWC = this.completeTestsWC.bind(this);
    this.getZeroProgressHeader = this.getZeroProgressHeader.bind(this);
    this.handleCloseSnackLimit = this.handleCloseSnackLimit.bind(this);
    this.handleCloseSnackCertificate = this.handleCloseSnackCertificate.bind(this);
    this.handleCloseSnackUnsupportedHost = this.handleCloseSnackUnsupportedHost.bind(this);
    this.handleCloseSnackTokenRest_1 = this.handleCloseSnackTokenRest_1.bind(this);
    this.openBalanceHandler = this.openBalanceHandler.bind(this);
    this.closeBalanceHandler = this.closeBalanceHandler.bind(this);
    this.closeNewbieHandler = this.closeNewbieHandler.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.prepareRowsWithError = this.prepareRowsWithError.bind(this);
  }

  ws = new WebSocket(SERVER);

  componentDidMount() {
    this.getInitialState().then(response => {
      this.setState(response);
    });

    this.ws.onopen = () => {
      console.log('ws connected');

      const credentials = this.getCredentialsWC();
      const json = JSON.stringify(credentials);
      this.ws.send(json);

      this.ws.onmessage = message => {
        const header = JSON.parse(message.data);

        // incoming messages from server
        if (header.type === RES_HEADER_TYPE.CONTROLLER) {
          switch (header.value) {
            case RES_HEADER_VALUE.PROGRAMS_LIMIT:
              this.setState({ sSnackLimit: PROGRAMS_LIMIT_SNACK_2 });
              break;
            case RES_HEADER_VALUE.OBTAIN_PROFILE:
              this.setState({ sProfile: header.user });
              break;
            case RES_HEADER_VALUE.TESTS_COMPLETED:
              getZets(this.state.sToken, this.state.sDegree).then(zetsResponse => {
                if (zetsResponse.type === RES_TYPE.OK) {
                  this.setState({ sTableHeader: null, sSelectedRows: [], sSelectedZets: 0, sDisabled: false, sZets: zetsResponse.data });
                }
              });
              break;
            case RES_HEADER_VALUE.TEST_COMPLETED:
              getZets(this.state.sToken, this.state.sDegree).then(zetsResponse => {
                if (zetsResponse.type === RES_TYPE.OK) {
                  const zeroHeader = this.getZeroProgressHeader();
                  const progressHeader = header.last ? null : zeroHeader;
                  this.setState({ sZets: zetsResponse.data, sTableHeader: progressHeader });
                  this.moveTestToCompleted(header.programId);
                }
              });
              break;
            case RES_HEADER_VALUE.CERTIFICATE_NOT_OBTAINED:
              this.prepareRowsWithError(header.programId, ERROR_CAUSES.CERTIFICATE, header.last);
              break;
            case RES_HEADER_VALUE.UNSUPPORTED_HOSTNAME:
              this.prepareRowsWithError(header.programId, ERROR_CAUSES.UNSUPPORTED_HOSTNAME, header.last);
              break;
            case RES_HEADER_VALUE.TOKEN_REST_ERROR:
              const dispDialogNewbie = this.state.sZets === 0 ? true : false;

              this.setState({ sDialogNewbieOpen: dispDialogNewbie, sSnackTokenRest_1: TOKENREST_ERROR_SNACK_1, sDisabled: false, sTableHeader: null });
              break;
            case RES_HEADER_VALUE.SERVER_ERROR:
              this.setState({ sServerError: true, sServerErrorType: SERVER_ERROR_TYPE.INSIDE });
              break;
          }
        } else if (header.type === RES_HEADER_TYPE.HEADER) {
          const selectedRows = this.state.sSelectedRows; //???
          this.setState({ sTableHeader: header, sSelectedRows: selectedRows });
        }
      }

      this.ws.onclose = () => {
        console.log('ws on client disconnected');
        this.setState({ sServerError: true })
      }
    }
  }

  async getInitialState() {
    try {
      let initialState = { sServerError: true };

      const idpTicket = await getIdpTicket(this.props.login, this.props.password);
      const token = await getToken(idpTicket.data, this.props.degree);
      const cycleProgram = await getCycleProgram(token.data, this.props.degree);
      const zets = await getZets(token.data, this.props.degree);
      const userName = await getName(token.data, this.props.degree);

      this.setState({ sPreloaderText: PRELOADER_STEP_2 });

      const programs = await getIomPrograms(token.data, cycleProgram.data.cycleId, cycleProgram.data.programId, this.props.degree);

      if (idpTicket.type === RES_TYPE.OK && token.type === RES_TYPE.OK && cycleProgram.type === RES_TYPE.OK && zets.type === RES_TYPE.OK && userName.type === RES_TYPE.OK && programs.type === RES_TYPE.OK) {
        const wsDisconnected = this.ws.readyState !== 1;

        initialState = {
          sIdpTicket: idpTicket.data,
          sToken: token.data,
          sDegree: this.props.degree,
          sCycleId: cycleProgram.data.cycleId,
          sProgramId: cycleProgram.data.programId,
          sZets: zets.data,
          sUserName: userName.data,
          sIomPrograms: programs.data,
          sServerError: wsDisconnected,
          sPreloaderText: PRELOADER_STEP_3,
        }
      }

      return initialState;
    }
    catch (err) {
      console.log('getInitialState -');
      console.log(err);
      this.setState({ sServerError: true });
    }

  }

  prepareRowsWithError(iProgramId, iErrorType, iLast) {
    const zeroHeader = this.getZeroProgressHeader();
    const progressHeader = iLast ? null : zeroHeader;

    const oldMasteredT = this.state.sIomPrograms.masteredT;
    const newMasteredF = this.state.sIomPrograms.masteredF.map(program => {
      let newProgram = program;

      if (program.id === iProgramId)
        newProgram.error = iErrorType;

      return newProgram;
    });

    const newIomPrograms = {
      'masteredT': oldMasteredT,
      'masteredF': newMasteredF,
    };

    if (iErrorType === ERROR_CAUSES.CERTIFICATE)
      this.setState({ sIomPrograms: newIomPrograms, sSnackCertificate: CERTIFICATE_SNACK, sTableHeader: progressHeader });
    else if (iErrorType === ERROR_CAUSES.UNSUPPORTED_HOSTNAME)
      this.setState({ sIomPrograms: newIomPrograms, sSnackHostName: UNSUPPORTED_HOST_SNACK, sTableHeader: progressHeader });
  }

  openBalanceHandler() {
    this.setState({ sDialogBalanceOpen: true });
  }
  closeBalanceHandler() {
    this.setState({ sDialogBalanceOpen: false });
  }
  closeNewbieHandler() {
    this.setState({ sDialogNewbieOpen: false });
  }

  handleCloseSnackLimit() {
    this.setState({ sSnackLimit: null });
  }
  handleCloseSnackCertificate() {
    this.setState({ sSnackCertificate: null });
  }
  handleCloseSnackUnsupportedHost() {
    this.setState({ sSnackHostName: null });
  }
  handleCloseSnackTokenRest_1() {
    this.setState({ sSnackTokenRest_1: null });
  }

  handleSelectRowsAll(e, iRows) {
    if (!this.state.sDisabled) {
      let ids = [];
      let zets = 0;

      if (e.target.checked) {
        for (let prog of iRows) {
          ids.push(prog.id);
          zets += prog.zet;
        }
        this.setState({ sSelectedRows: ids, sSelectedZets: zets });
      } else
        this.setState({ sSelectedRows: [], sSelectedZets: 0 });
    }
  }

  handleSelectRow(e, iRow, iSelected) {
    if (!this.state.sDisabled && !iRow.error) {
      const selectedIndex = iSelected.indexOf(iRow.id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(iSelected, iRow.id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(iSelected.slice(1));
      } else if (selectedIndex === iSelected.length - 1) {
        newSelected = newSelected.concat(iSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          iSelected.slice(0, selectedIndex),
          iSelected.slice(selectedIndex + 1),
        );
      }

      if (selectedIndex < 0)
        this.setState((prevState, props) => ({
          sSelectedRows: newSelected,
          sSelectedZets: prevState.sSelectedZets + iRow.zet
        }))
      else
        this.setState((prevState, props) => ({
          sSelectedRows: newSelected,
          sSelectedZets: prevState.sSelectedZets - iRow.zet
        }))
    }
  }

  getCredentialsWC() {
    return {
      type: RES_HEADER_TYPE.CONTROLLER,
      value: RES_HEADER_VALUE.OBTAIN_PROFILE,
      login: this.props.login,
      password: this.props.password
    }
  }
  completeTestsWC(iPrograms) {
    const profile = {
      login: this.props.login,
      password: this.props.password,
      cycleId: this.state.sCycleId,
      programId: this.state.sProgramId,
      degree: this.state.sDegree
    }

    const data = {
      profile: profile,
      programs: iPrograms
    }

    return {
      type: RES_HEADER_TYPE.CONTROLLER,
      value: RES_HEADER_VALUE.COMPLETE_TESTS,
      data: data
    }
  }

  getZeroProgressHeader() {
    return {
      type: RES_HEADER_TYPE.HEADER,
      testType: TEST_TYPE.TEST,
      id: null,
      name: null,
      status: 0,
      zeroHeader: true
    }
  }

  handleTableSubmit(e, iRows) {
    const balance = this.state.sProfile.queriesLeft;

    if (!this.state.sProfile.vip && balance < iRows.length) {
      const message = <div className='snackContentWrapper'>
        <div>{PROGRAMS_LIMIT_SNACK_1.message}</div>
        <div>{PROGRAMS_LIMIT_SNACK_1.balance}{balance}. {PROGRAMS_LIMIT_SNACK_1.test}{iRows.length}</div>
      </div>
      this.setState({ sSnackLimit: message });

      return;
    }

    const data = this.completeTestsWC(iRows);
    const json = JSON.stringify(data);
    this.ws.send(json);

    const zeroHeader = this.getZeroProgressHeader();

    this.setState({ sDisabled: true, sTableHeader: zeroHeader });
  }

  handleClearNotifications(e) {
    this.setState({ sNotifications: 0 });
  }

  prepareSelectedRows = (iSelectedRows, iRows) => {
    const preparedRows = iRows.filter(row => {
      for (let selRow of iSelectedRows) {
        if (row.id === selRow)
          return true;
      }
    })

    return preparedRows;
  }

  moveTestToCompleted = (iProgramId) => {
    const programToMove = this.state.sIomPrograms.masteredF.find(program =>
      program.id === iProgramId);

    const newMasteredF = this.state.sIomPrograms.masteredF.filter(program =>
      program.id !== iProgramId);
    let newMasteredT = this.state.sIomPrograms.masteredT;
    newMasteredT.push(programToMove);

    const newIomPrograms = {
      'masteredT': newMasteredT,
      'masteredF': newMasteredF,
    }

    this.setState((prevState, props) => ({
      sNotifications: prevState.sNotifications + 1,
      sIomPrograms: newIomPrograms
    }))
  }

  render() {
    let content = <Preloader text={this.state.sPreloaderText} />

    const tableDisabled = this.state.sDisabled;
    const buttonDisabled = this.state.sDisabled || this.state.sSelectedRows.length === 0;

    if (!this.state.sServerError && this.state.sIomPrograms && this.state.sProfile) {
      const progTable = <ProgTable
        rows={this.state.sIomPrograms.masteredF}
        selectedRowHandler={this.handleSelectRow}
        selectedRowsHandler={this.handleSelectRowsAll}
        selectedRows={this.state.sSelectedRows}
        disabled={tableDisabled}
        selectedZETs={this.state.sSelectedZets} />;
      const progTableCompleted = <ProgTableCompleted rows={this.state.sIomPrograms.masteredT} />;
      const balanceButton = !this.state.sProfile.vip ?
        <div className='balanceButtonContainer'>
          <Button variant='outlined' onClick={this.openBalanceHandler}>
            Пополнить баланс
              </Button>
        </div> : <div />;

      content = <div >
        <Profile name={this.state.sUserName} zets={this.state.sZets} queriesLeft={this.state.sProfile.queriesLeft} premium={this.state.sProfile.vip} />
        <Log header={this.state.sTableHeader} selectedRows={this.state.sSelectedRows} selectedZETs={this.state.sSelectedZets} />
        <TabsLight completed={progTableCompleted} complete={progTable} notifications={this.state.sNotifications}
          clearNotoficationsHandler={this.handleClearNotifications} />
        <div className='contentButtonsContainer'>
          <div className='passtestsButtonContainer'>
            <Button variant="contained" color="secondary" disabled={buttonDisabled}
              onClick={(e) => this.handleTableSubmit(e, this.prepareSelectedRows(this.state.sSelectedRows, this.state.sIomPrograms.masteredF))}>
              ПРОЙТИ ТЕСТЫ
          </Button>
          </div>
          {balanceButton}
        </div>
        <DialogBalance open={this.state.sDialogBalanceOpen} snils={this.props.login} closeBalanceHandler={this.closeBalanceHandler} />
        <DialogNewbie open={this.state.sDialogNewbieOpen} closeNewbieHandler={this.closeNewbieHandler} />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          key='snackContentLimit'
          open={this.state.sSnackLimit ? true : false}
          onClose={this.handleCloseSnackLimit}>
          <MuiAlert elevation={6} variant="standard" severity="info" >
            {this.state.sSnackLimit}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          key='snackContentCertificate'
          open={this.state.sSnackCertificate ? true : false}
          onClose={this.handleCloseSnackCertificate}
        >
          <MuiAlert elevation={6} variant="standard" severity="warning">
            {this.state.sSnackCertificate}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          key='snackContentUnsupportedHost'
          open={this.state.sSnackHostName ? true : false}
          onClose={this.handleCloseSnackUnsupportedHost}
        >
          <MuiAlert elevation={6} variant="standard" severity="warning">
            {this.state.sSnackHostName}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          key='snackContentTokenRest_1'
          open={this.state.sSnackTokenRest_1 ? true : false}
          onClose={this.handleCloseSnackTokenRest_1}
        >
          <MuiAlert elevation={6} variant="standard" severity="warning">
            {this.state.sSnackTokenRest_1}
          </MuiAlert>
        </Snackbar>
      </div>
    }
    else if (this.state.sServerError)
      content = <ServerError errorType={this.state.sServerErrorType} />;

    return (<ThemeProvider theme={theme}>{content}</ThemeProvider>)
  }
}

export default Content;