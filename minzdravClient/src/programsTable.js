import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';
import cautionImg from './resources/caution.png';
import {PACKAGE, CERTIFICATE_ERROR_TIP, UNSUPPORTED_HOST_ERROR_TIP } from './const';

const useMuStyles = makeStyles({
  paper: {
    width: '100%',
  },
  chip: {
    marginLeft: '0.5rem',
    minWidth: '2.4rem',
    textAlign: 'center',
    visibility: props => props.chipsVisible ? 'visible' : 'hidden',
    '@media (max-width: 830px)': {
      fontSize: '0.77rem',
    }

  },
  tableCell: {
    fontSize: '0.845rem',
    '@media (max-width: 730px)': {
      fontSize: '0.84rem',
    }
  }
});

const Container = styled.div`
@media screen and (max-width: 830px) {
    .tableContainer {
      margin: -13px -13px -13px 0px;
    }
  }`;

const CautionIcon = styled.img`
    padding-right: 3px;
    width: 13px;
    transform: translateY(1px);

    @media screen and (max-width: 1282px) {
      width: 12px;
}`;

export default function ProgramsTable(props) {
  const [page, setPage] = useState(0);

  let selectedRows = props.selectedRows;

  const rows = props.rows;
  const rowsPerPage = 10;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const chipsVisible = selectedRows.length > 0;
  const muStyles = useMuStyles({ chipsVisible: chipsVisible });

  const getRow = (iRow) => {
    const isItemSelected = isSelected(iRow.id);
    const labelId = `complete-programs-${iRow.id}`;
    let checkboxChecked = isItemSelected;
    let content =
      <TableCell className={muStyles.tableCell} component="th" id={labelId} scope="row" padding="none">
        {iRow.name}
      </TableCell>;

    if (iRow.error) {
      let ttipText = '';

      if (iRow.error === PACKAGE.ERROR_CAUSED_BY.CERTIFICATE)
        ttipText = CERTIFICATE_ERROR_TIP;
      else if (iRow.error === PACKAGE.ERROR_CAUSED_BY.UNSUPPORTED_HOSTNAME)
        ttipText = UNSUPPORTED_HOST_ERROR_TIP;

      const ttip1 = <Tooltip title={ttipText}>
        <CautionIcon src={cautionImg} />
      </Tooltip>;
      const ttip2 = <Tooltip title={ttipText}>
        <span>{iRow.name}</span>
      </Tooltip>;
      content =
        <TableCell className={muStyles.tableCell} component="th" id={labelId} scope="row" padding="none">
          <span style={{ cursor: 'help' }}>{ttip1}</span>
          <span style={{ cursor: 'help', paddingLeft: '0.2vw' }}>{ttip2}</span>
        </TableCell>;
      checkboxChecked = false;
    }

    return (
      <TableRow
        hover
        onClick={(e) => props.selectedRowHandler(e, iRow, selectedRows)}
        role="checkbox"
        aria-checked={checkboxChecked}
        tabIndex={-1}
        key={labelId}
        selected={checkboxChecked}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={checkboxChecked}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {content}
        <TableCell className={muStyles.tableCell} align="right" style={{ paddingRight: '63px' }}>
          {iRow.zet}
        </TableCell>
      </TableRow>
    );
  }

  const isSelected = id => selectedRows.indexOf(id) !== -1;

  return (
    <Container>
      <Paper className={muStyles.paper}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                    checked={rows.length > 0 && selectedRows.length === rows.length}
                    onChange={(e) => props.selectedRowsHandler(e, rows)}
                    inputProps={{ 'aria-label': 'select all desserts' }} />
                </TableCell>
                <TableCell className={muStyles.tableCell} key='name' align='left' padding='none'>
                  <span>Тесты</span>
                  <Chip label={selectedRows.length} size="small" className={muStyles.chip}
                  />
                </TableCell>
                <TableCell className={muStyles.tableCell} key='zet' align='right' padding='normal' style={{ minWidth: '125px' }}>
                  <span>Баллы</span>
                  <Chip label={props.selectedZETs} size="small" className={muStyles.chip}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  return getRow(row);
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (33) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(e, newPage) => (setPage(newPage))}
        />
      </Paper>
    </Container>);
}