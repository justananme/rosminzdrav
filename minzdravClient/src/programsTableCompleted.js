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
import styled from 'styled-components';

const useMuStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    table: {
        minWidth: 750,
    },
    tableCell: {
        fontSize: '0.845rem',
        '@media (max-width: 730px)': {
            fontSize: '0.84rem',
        }
    }
}));

const Container = styled.div`
@media screen and (max-width: 830px) {
      margin: -13px -13px -13px 0px;
  }`;

export default function ProgramsTableCompleted(props) {
    const muStyles = useMuStyles();

    const rowsPerPage = 10;
    const [page, setPage] = useState(0);

    const rows = props.rows;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <Container>
            <div className={muStyles.root}>
                <Paper className={muStyles.paper}>
                    <TableContainer>
                        <Table
                            className={muStyles.table}
                            aria-labelledby="tableTitle"
                            size="small"
                            aria-label="enhanced table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={muStyles.tableCell} key='name' align='left' style={{ padding: '0px 12px 0 16px' }}>Тесты</TableCell>
                                    <TableCell className={muStyles.tableCell} key='zet' align='right' padding='normal'>Баллы</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        const labelId = `completed-programs-${row.id}`;

                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={labelId}>
                                                <TableCell className={muStyles.tableCell} component='th' id={labelId} scope='row' style={{ padding: '0px 12px 0 16px' }}>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell className={muStyles.tableCell} align='right' >
                                                    {row.zet}
                                                </TableCell>
                                            </TableRow>
                                        );
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
            </div>
        </Container>
    );
}