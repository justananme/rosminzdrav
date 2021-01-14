import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { PAYMENT } from './const';

import paymentIMG from './resources/payment.png';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class DialogBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const commentField = "СНИЛС " + this.props.snils;
        const pricePAYG = <div className='paymentOptions'>
            <div className='paymentPrice'>{PAYMENT.PRICE_ONE}</div>
            <div className='paymentCaption'>Один тест</div>
        </div>

        const pricePrepayed = <div className='paymentOptions'>
            <div className='paymentPrice'>{PAYMENT.PRICE_UNLIMITED}</div>
            <div className='paymentCaption'>Безлимит</div>
        </div>

        const paymentOptions = <div className='paymentOptionsContainer'>
            {pricePAYG}
            <div className='paymentOR'>или</div>
            {pricePrepayed}
        </div>

        return (
            <Dialog
                className='dialogBalance'
                open={this.props.open}
                onClose={this.props.closeBalanceHandler}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.closeBalanceHandler}>
                    Пополнить баланс
                </DialogTitle>
                <div className='balancePaymentDetails'>
                    <div style={{ textAlign: 'center' }}><img src={paymentIMG} alt="payment option" /></div>
                    <List >
                        <li>
                            <Typography
                                className='dividerInset'
                                color="textSecondary"
                                display="block"
                                variant="caption"
                            >
                                Номер карты сбербанка
                        </Typography>
                        </li>
                        <ListItem>
                            <ListItemText className='balanceItem' primary={PAYMENT.CARD} />
                        </ListItem>
                        <Divider component="li" />
                        <li>
                            <Typography
                                className='dividerInset'
                                color="textSecondary"
                                display="block"
                                variant="caption"
                            >
                                Комментарий к переводу
                        </Typography>
                        </li>
                        <ListItem>
                            <ListItemText className='balanceItem' primary={commentField} />
                        </ListItem>
                        <Divider component="li" />
                        <li>
                            <Typography
                                className='dividerInset'
                                color="textSecondary"
                                display="block"
                                variant="caption"
                            >
                                Сумма
                        </Typography>
                        </li>
                        <ListItem>
                            <ListItemText className='balanceItem' primary={paymentOptions} />
                        </ListItem>
                    </List>
                    <div className='paymentDescription'>
                        <div>На пример</div>
                        <div>370р = 10 тестов</div>
                        <div>600р = прохождение всех тестов</div>
                        <div style={{ marginTop: '8px' }}>После получения перевода, ваш баланс будет пополнен в течении часа</div>
                    </div>
                </div>
            </Dialog>
        )
    }
}


export default DialogBalance;