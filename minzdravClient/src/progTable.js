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

import cautionIMG from './resources/caution.png';

import { ERROR_CAUSES, CERTIFICATE_ERROR_TIP, UNSUPPORTED_HOST_ERROR_TIP } from './const';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  table: props => ({
    minWidth: 750,
    '& tr[aria-checked="true"]': {
      backgroundColor: props.bgColor
    },
    '& tr[aria-checked="true"]:hover': {
      backgroundColor: props.bgColorHover
    }
  }),
  tooltip: {
    fontSize: '1.2rem',
    verticalAlign: 'middle',
    paddingLeft: '0.25rem'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classesProps = {
    bgColor: props.disabled ? '#0000000a' : '#f5005714',
    bgColorHover: props.disabled ? '#0000000a' : '#f5005714'
  };
  const classes = useStyles(classesProps);

  let selected = props.selectedRows;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const rows = props.rows;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRow = (iRow) => {
    const isItemSelected = isSelected(iRow.id);
    const labelId = `complete-programs-${iRow.id}`;
    let checkboxChecked = isItemSelected;
    let bgColor = {};
    let content = <TableCell className='progTableCell' component="th" id={labelId} scope="row" padding="none">
      {iRow.name}
    </TableCell>;

    if (iRow.error) {
      let ttipText = '';

      if (iRow.error === ERROR_CAUSES.CERTIFICATE)
        ttipText = CERTIFICATE_ERROR_TIP;
      else if (iRow.error === ERROR_CAUSES.UNSUPPORTED_HOSTNAME)
        ttipText = UNSUPPORTED_HOST_ERROR_TIP;

      const ttip1 = <Tooltip title={ttipText}>
        <img className='imgError' src={cautionIMG} alt="caution" />
      </Tooltip>;
      const ttip2 = <Tooltip title={ttipText}>
        <span>{iRow.name}</span>
      </Tooltip>;
      content = <TableCell className='progTableCell' component="th" id={labelId} scope="row" padding="none">
        <span style={{ cursor: 'help' }}>{ttip1}</span>
        <span style={{ cursor: 'help', paddingLeft: '0.2vw' }}>{ttip2}</span>
      </TableCell>;
      checkboxChecked = false;
    }

    return (
      <TableRow
        hover
        onClick={(e) => props.selectedRowHandler(e, iRow, selected)}
        role="checkbox"
        aria-checked={checkboxChecked}
        tabIndex={-1}
        key={labelId}
        selected={checkboxChecked}
        style={bgColor}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={checkboxChecked}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {content}
        <TableCell className='progTableCell' align="right" style={{ paddingRight: '63px' }}>
          {iRow.zet}
        </TableCell>
      </TableRow>
    );
  }

  const isSelected = id => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className='progTableContainer'>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="small"
              aria-label="enhanced table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < rows.length}
                      checked={rows.length > 0 && selected.length === rows.length}
                      onChange={(e) => props.selectedRowsHandler(e, rows)}
                      inputProps={{ 'aria-label': 'select all desserts' }} />
                  </TableCell>
                  <TableCell className='progTableCell' key='name' align='left' padding='none'>
                    <span>Тесты</span>
                    <Chip label={selected.length} size="small" className='progTableChip'
                      style={{
                        visibility: selected.length === 0 ? 'hidden' : 'visible'
                      }}
                    />
                  </TableCell>
                  <TableCell className='progTableCell' key='zet' align='right' padding='default' style={{ minWidth: '125px' }}>
                    <span>Баллы</span>
                    <Chip label={props.selectedZETs} size="small" className='progTableChip'
                      style={{
                        visibility: props.selectedZETs === 0 ? 'hidden' : 'visible'
                      }}
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
            rowsPerPageOptions={[10]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>);
}