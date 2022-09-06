import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MessageBar from './messageBar';
import Profile from './userProfile.js';
import ProgramsTable from './programsTable';
import ProgramsTableCompleted from './programsTableCompleted';
import Log from './log';
import TabsLight from './tabs';
import DialogBalance from './dialogBalance';
import Preloader from './preloader';
import ServerError from './serverError';
import styled from 'styled-components';

import { queries } from "./profile";
import {
  PACKAGE, SERVER, CERTIFICATE_SNACK, UNSUPPORTED_HOST_SNACK,
  TOKENREST_ERROR_SNACK_1, PRELOADER_STEP_1, PRELOADER_STEP_2, PRELOADER_STEP_3,
  PROGRAMS_LIMIT_SNACK_1, PROGRAMS_LIMIT_SNACK_2, SERVER_ERROR_TYPE
} from './const';

const useMuStyles = theme => ({
  passButton: {
    width: 'max-content',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '600',
    lineHeight: '1.4',
    padding: '8px 16px',
    '@media (max-width: 530px)': {
      width: '100%',
    }
  },
  balanceButton: {
    backgroundColor: 'white',
    border: '1px solid rgba(25, 118, 210, 0.5)',
    color: '#1976d2',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '600',
    lineHeight: '1.4',
    padding: '8px 16px',
    '@media (max-width: 530px)': {
      width: '100%',
    }
  }
});

const ButtonsContainer = styled.div`
    margin-left: 24px;
    padding-bottom: 10px;
    display: flex;

    @media screen and (max-width: 830px) {
      margin-left: 12px;
      margin-right: 12px;
    }
    @media screen and (max-width: 530px) {
      display: flex;
      flex-direction: column;
    }
`;

const BalanceButtonContainer = styled.div`
  display: inline-block;
  margin-left: 24px;
  width: 100%;

  @media screen and (max-width: 730px) {
    margin-left: 10px;
    margin-top: 0px;
  }
  @media screen and (max-width: 530px) {
    margin-left: 0px;
    margin-top: 10px;
    width: 100%;
  }`;

const WarningsContainer = styled.div`
  @media screen and (max-width: 830px) {
    font-size: 0.845rem;
  }
  @media screen and (max-width: 730px) {
    font-size: 0.84rem;
    margin: -3px 0px;
  }
  @media screen and (max-width: 530px) {
    margin: -5px 0px;
  }
  `;

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
      // sProfile: null,
      sProfile: { vip: false, queriesLeft: 0, login: this.props.login }, // Заглушка
      sSnackLimit: null,
      sSnackCertificate: null,
      sSnackHostName: null,
      sSnackTokenRest_1: null,
      sServerErrorType: SERVER_ERROR_TYPE.OUTSIDE,
      sDialogBalanceOpen: false,
    };

    this.handleTableSubmit = this.handleTableSubmit.bind(this);
    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleSelectRowsAll = this.handleSelectRowsAll.bind(this);
    this.prepareSelectedRows = this.prepareSelectedRows.bind(this);
    this.handleClearNotifications = this.handleClearNotifications.bind(this);
    this.handleCloseMessageBar = this.handleCloseMessageBar.bind(this);
  }

  // ws = new WebSocket(SERVER);
  ws = null;


  async componentDidMount() {
    const initialState = await this.getInitialState();
    this.setState(initialState);

    // заглушка
    // this.ws.onopen = wsOnOpen();

    const wsOnOpen = function () {
      console.log('ws connected');

      const credentials = this.getCredentialsWC();
      const json = JSON.stringify(credentials);
      this.ws.send(json);

      this.ws.onmessage = message => {
        const header = JSON.parse(message.data);

        // incoming messages from server
        if (header.type === PACKAGE.RESPONSE_HEADER_TYPE.CONTROLLER) {
          switch (header.value) {
            case PACKAGE.RESPONSE_HEADER_VALUE.PROGRAMS_LIMIT:
              this.setState({ sSnackLimit: PROGRAMS_LIMIT_SNACK_2 });
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.OBTAIN_PROFILE:
              this.setState({ sProfile: header.user });
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.TESTS_COMPLETED:
              queries.fetchZets(this.state.sToken, this.state.sDegree).then(zetsResponse => {
                if (zetsResponse.type === PACKAGE.RESPONSE_TYPE.OK) {
                  this.setState({ sTableHeader: null, sSelectedRows: [], sSelectedZets: 0, sDisabled: false, sZets: zetsResponse.data });
                }
              });
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.TEST_COMPLETED:
              queries.fetchZets(this.state.sToken, this.state.sDegree).then(zetsResponse => {
                if (zetsResponse.type === PACKAGE.RESPONSE_TYPE.OK) {
                  const zeroHeader = this.getZeroProgressHeader();
                  const progressHeader = header.last ? null : zeroHeader;
                  this.setState({ sZets: zetsResponse.data, sTableHeader: progressHeader });
                  this.moveTestToCompleted(header.programId);
                }
              });
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.CERTIFICATE_NOT_OBTAINED:
              this.prepareRowsWithError(header.programId, PACKAGE.ERROR_CAUSED_BY.CERTIFICATE, header.last);
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.UNSUPPORTED_HOSTNAME:
              this.prepareRowsWithError(header.programId, PACKAGE.ERROR_CAUSED_BY.UNSUPPORTED_HOSTNAME, header.last);
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.TOKEN_REST_ERROR:
              this.setState({ sSnackTokenRest_1: TOKENREST_ERROR_SNACK_1, sDisabled: false, sTableHeader: null });
              break;
            case PACKAGE.RESPONSE_HEADER_VALUE.SERVER_ERROR:
              this.setState({ sServerError: true, sServerErrorType: SERVER_ERROR_TYPE.INSIDE });
              break;
          }
        } else if (header.type === PACKAGE.RESPONSE_HEADER_TYPE.HEADER) {
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

      const idpTicket = await queries.fetchIdpTicket(this.props.login, this.props.password);
      const token = await queries.fetchToken(idpTicket.data, this.props.degree);
      const cycleProgram = await queries.fetchCycleProgram(token.data, this.props.degree);
      const zets = await queries.fetchZets(token.data, this.props.degree);
      const userName = await queries.fetchName(token.data, this.props.degree);

      this.setState({ sPreloaderText: PRELOADER_STEP_2 });

      const programs = await queries.fetchIomPrograms(token.data, cycleProgram.data.cycleId, cycleProgram.data.programId, this.props.degree);

      if (idpTicket.type === PACKAGE.RESPONSE_TYPE.OK
        && token.type === PACKAGE.RESPONSE_TYPE.OK
        && cycleProgram.type === PACKAGE.RESPONSE_TYPE.OK
        && zets.type === PACKAGE.RESPONSE_TYPE.OK
        && userName.type === PACKAGE.RESPONSE_TYPE.OK
        && programs.type === PACKAGE.RESPONSE_TYPE.OK) {
        // const wsDisconnected = this.ws.readyState !== 1;
        const wsDisconnected = false; // заглушка

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

    if (iErrorType === PACKAGE.ERROR_CAUSED_BY.CERTIFICATE)
      this.setState({ sIomPrograms: newIomPrograms, sSnackCertificate: CERTIFICATE_SNACK, sTableHeader: progressHeader });
    else if (iErrorType === PACKAGE.ERROR_CAUSED_BY.UNSUPPORTED_HOSTNAME)
      this.setState({ sIomPrograms: newIomPrograms, sSnackHostName: UNSUPPORTED_HOST_SNACK, sTableHeader: progressHeader });
  }

  handleCloseMessageBar(e) {
    if (e.target.id === 'passTestsButton' || e.target.id === 'passTestsButtonSpan')
      return;

    let updatedSnacks = {
      sSnackLimit: null,
      sSnackCertificate: null,
      sSnackHostName: null,
      sSnackTokenRest_1: null,
    };

    this.setState(updatedSnacks);
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
      type: PACKAGE.RESPONSE_HEADER_TYPE.CONTROLLER,
      value: PACKAGE.RESPONSE_HEADER_VALUE.OBTAIN_PROFILE,
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
      type: PACKAGE.RESPONSE_HEADER_TYPE.CONTROLLER,
      value: PACKAGE.RESPONSE_HEADER_VALUE.COMPLETE_TESTS,
      data: data
    }
  }

  getZeroProgressHeader() {
    return {
      type: PACKAGE.RESPONSE_HEADER_TYPE.HEADER,
      testType: PACKAGE.TEST_TYPE.TEST,
      id: null,
      name: null,
      status: 0,
      zeroHeader: true
    }
  }

  handleTableSubmit(e, iRows) {
    const balance = this.state.sProfile.queriesLeft;

    if (!this.state.sProfile.vip && balance < iRows.length) {
      const message =
        <WarningsContainer>
          <div>{PROGRAMS_LIMIT_SNACK_1.message}</div>
          <div>{PROGRAMS_LIMIT_SNACK_1.balance}{balance}. {PROGRAMS_LIMIT_SNACK_1.test}{iRows.length}</div>
        </WarningsContainer>
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
    const { classes } = this.props;

    let content = <Preloader text={this.state.sPreloaderText} />

    const tableDisabled = this.state.sDisabled;
    const buttonDisabled = this.state.sDisabled || this.state.sSelectedRows.length === 0;

    if (!this.state.sServerError && this.state.sIomPrograms && this.state.sProfile) {
      const programsTable = <ProgramsTable
        rows={this.state.sIomPrograms.masteredF}
        selectedRowHandler={this.handleSelectRow}
        selectedRowsHandler={this.handleSelectRowsAll}
        selectedRows={this.state.sSelectedRows}
        disabled={tableDisabled}
        selectedZETs={this.state.sSelectedZets} />;

      const programsTableCompleted = <ProgramsTableCompleted rows={this.state.sIomPrograms.masteredT} />;

      const balanceButton = !this.state.sProfile.vip
        ? <BalanceButtonContainer>
          <Button
            className={classes.balanceButton}
            variant='outlined'
            onClick={() => this.setState({ sDialogBalanceOpen: true })}>
            Пополнить баланс
          </Button>
        </BalanceButtonContainer>
        : <div />;

      content = <div >
        <Profile name={this.state.sUserName}
          zets={this.state.sZets}
          queriesLeft={this.state.sProfile.queriesLeft}
          premium={this.state.sProfile.vip} />
        <Log header={this.state.sTableHeader} selectedRows={this.state.sSelectedRows} selectedZETs={this.state.sSelectedZets} />
        <TabsLight
          completed={programsTableCompleted}
          complete={programsTable}
          notifications={this.state.sNotifications}
          clearNotoficationsHandler={this.handleClearNotifications} />
        <ButtonsContainer>
          <div>
            <Button
              id='passTestsButton'
              className={classes.passButton}
              variant="contained"
              color="secondary"
              disabled={buttonDisabled}
              onClick={(e) => this.handleTableSubmit(e, this.prepareSelectedRows(this.state.sSelectedRows, this.state.sIomPrograms.masteredF))}>
              <span
                id='passTestsButtonSpan'
                onClick={(e) => this.handleTableSubmit(e, this.prepareSelectedRows(this.state.sSelectedRows, this.state.sIomPrograms.masteredF))}>
                ПРОЙТИ ТЕСТЫ
              </span>
            </Button>
          </div>
          {balanceButton}
        </ButtonsContainer>
        <DialogBalance
          open={this.state.sDialogBalanceOpen}
          snils={this.props.login}
          closeBalanceHandler={() => this.setState({ sDialogBalanceOpen: false })}
        />
        <MessageBar
          severity='error'
          isOpen={this.state.sSnackLimit ? true : false}
          content={this.state.sSnackLimit}
          closeHandler={this.handleCloseMessageBar}
        />
        <MessageBar
          severity='error'
          isOpen={this.state.sSnackCertificate ? true : false}
          content={this.state.sSnackCertificate}
          closeHandler={this.handleCloseMessageBar}
        />

        <MessageBar
          severity='error'
          isOpen={this.state.sSnackHostName ? true : false}
          content={this.state.sSnackHostName}
          closeHandler={this.handleCloseMessageBar}
        />

        <MessageBar
          severity='error'
          isOpen={this.state.sSnackTokenRest_1 ? true : false}
          content={this.state.sSnackTokenRest_1}
          closeHandler={this.handleCloseMessageBar}
        />
      </div>
    }
    else if (this.state.sServerError)
      content = <ServerError errorType={this.state.sServerErrorType} />;

    return content;
  }
}
export default withStyles(useMuStyles)(Content)