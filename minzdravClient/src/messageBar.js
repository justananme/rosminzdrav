import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function MessageBar(props) {
    const messageBar = <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={props.isOpen}
        onClose={props.closeHandler}>
        <MuiAlert
            elevation={6}
            variant="standard"
            severity={props.severity}>
            {props.content}
        </MuiAlert>
    </Snackbar>

    return messageBar;
}

export default MessageBar;